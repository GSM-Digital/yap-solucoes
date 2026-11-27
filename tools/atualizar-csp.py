#!/usr/bin/env python3
"""Atualiza os hashes sha256 da CSP no .htaccess a partir do index.html.

Uso (na raiz do repositório):  python3 tools/atualizar-csp.py
Rode sempre que mudar o script do GTM ou o bloco <style> do index.html.
Com --check, só confere: sai com erro se o .htaccess estiver desatualizado.
"""
import base64, hashlib, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
html = (ROOT / "index.html").read_text(encoding="utf-8")
ht_path = ROOT / ".htaccess"
ht = ht_path.read_text(encoding="utf-8")

def sha(text):
    return "'sha256-" + base64.b64encode(hashlib.sha256(text.encode("utf-8")).digest()).decode() + "'"

scripts = [m.group(2) for m in re.finditer(r"<script(\s[^>]*)?>(.*?)</script>", html, re.S)
           if not re.search(r'\bsrc=|type="application/ld\+json"', m.group(1) or "")]
styles = [m.group(1) for m in re.finditer(r"<style>(.*?)</style>", html, re.S)]

def set_hashes(policy, directive, hashes):
    def repl(m):
        tokens = [t for t in m.group(2).split() if not t.startswith("'sha256-")]
        return m.group(1) + " ".join(tokens[:1] + hashes + tokens[1:])
    new, n = re.subn(r"(" + directive + r" )([^;\"]*)", repl, policy, count=1)
    if n != 1:
        sys.exit(f"Diretiva {directive} não encontrada no .htaccess")
    return new

new = set_hashes(ht, "script-src", [sha(s) for s in scripts])
new = set_hashes(new, "style-src", [sha(s) for s in styles])

if "--check" in sys.argv:
    if new != ht:
        sys.exit("CSP desatualizada: rode python3 tools/atualizar-csp.py")
    print("CSP em dia")
elif new != ht:
    ht_path.write_text(new, encoding="utf-8")
    print("Hashes da CSP atualizados no .htaccess")
else:
    print("CSP já estava em dia")
