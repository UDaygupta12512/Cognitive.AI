import urllib.request
import re
import ssl

try:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    html = urllib.request.urlopen('https://campaigns.icicibank.com/credit-card/noFee/index.html', context=ctx).read().decode('utf-8')
    matches = re.findall(r'assets/images/[a-zA-Z0-9_\-\.]+', html)
    print("\n".join(set(matches)))
except Exception as e:
    print("Error:", e)
