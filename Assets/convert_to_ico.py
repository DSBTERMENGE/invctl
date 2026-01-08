from PIL import Image

img = Image.open(r'C:\Applications_DSB\InvCtl\Assets\icon_invctl___.jpg')
img = img.resize((32, 32), Image.Resampling.LANCZOS)
img.save(r'C:\Applications_DSB\InvCtl\Assets\icon_invctl.ico', format='ICO')
print('✅ Convertido para ICO!')
