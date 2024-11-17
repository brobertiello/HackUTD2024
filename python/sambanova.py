import os
import openai

client = openai.OpenAI(
    api_key=os.environ.get("SAMBANOVA_API_KEY"),
    base_url="https://api.sambanova.ai/v1",
)

prompt = input("Type your response: ")

while prompt != 'q':
  
  response = client.chat.completions.create(
      model='Meta-Llama-3.1-8B-Instruct',
      messages=[{"role":"system","content":"You are a helpful assistant"},{"role":"user","content":prompt}],
      temperature =  0.1,
      top_p = 0.1
  )

  print(response.choices[0].message.content)

  prompt = input("Type your response or type 'q' to quit: ")