import sys
sys.stdout.reconfigure(encoding='utf-8')

from gradio_client import Client

client = Client("https://levihsu-ootdiffusion.hf.space")
print("\n=== API Structure ===")
print(client.view_api())
