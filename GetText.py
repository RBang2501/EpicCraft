import requests
headers = {
        "Content-Type": "application/json"
    }
def loadModel() :
    url = "https://blonde-poor-particle-feeds.trycloudflare.com/v1/internal/model/load"

    data = {
    "model_name": "TheBloke_MythoMax-L2-13B-GPTQ_gptq-4bit-32g-actorder_True",
    "args": {},
    "settings": {}
    }

    response = requests.post(url, headers=headers, json=data, verify=False)
    print(response)

def getTwist(baseinstruct, baseinput, overloadalpaca="") :
    inputtoalpaca = f"Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.### Instruction:\nInstruction{baseinstruct}\n### Input:\nInput{baseinput}\n### Response:"
    if(overloadalpaca!="") :
        inputtoalpaca = overloadalpaca
    payload = {
        "messages": [
        {
            "role": "user",
            "content": inputtoalpaca
        }
        ],
        "mode": "instruct",
        "instruction_template": "Alpaca"
    }
    payurl = "https://blonde-poor-particle-feeds.trycloudflare.com/v1/chat/completions"
    response = requests.post(payurl, headers=headers, json=payload, verify=False)
    return response.json()["choices"][0]["message"]["content"]

def getContinuation(baseinstruct, baseinput, overloadalpaca="", leafTwist = ""):
    if leafTwist != "":
        baseinstruct = baseinstruct + f" and write a fitting ending for the story such that it is {leafTwist}"

    inputtoalpaca = f"Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.### Instruction:\nInstruction{baseinstruct}\n### Input:\nInput{baseinput}\n### Response:"

    payload = {
        "messages": [
        {
            "role": "user",
            "content": inputtoalpaca
        }
        ],
        "mode": "instruct",
        "instruction_template": "Alpaca"
    }
    payurl = "https://blonde-poor-particle-feeds.trycloudflare.com/v1/chat/completions"
    response = requests.post(payurl, headers=headers, json=payload, verify=False)
    return response.json()["choices"][0]["message"]["content"]
baseinstruct = "Write a Chapters of story about a puppet that thinks it can become a boy. start the story with input and provide name for the chapter at the start. Chapter length 300 words only"
baseinput = "The wooden boy sat on the porch in a quaint old house"

RootTwist = getTwist(baseinstruct,baseinput)
print(RootTwist)
baseinstruct = f"give previously written chapter passed as input, continue the story 300 words ONLY, provide name for the chapter at the start"
baseinput = f"{RootTwist}"
Twist1 = getContinuation(baseinstruct,baseinput)
print(f"\n\n\n\n{Twist1}")
baseinstruct = f"give previously written chapter passed as input, continue the story 300 words ONLY, provide name for the chapter at the start"
baseinput = f"{RootTwist+Twist1}"
Twist2 = getContinuation(baseinstruct,baseinput)
print(f"\n\n\n\n{Twist2}")
baseinstruct = f"give previously written chapter passed as input, continue the story 300 words ONLY, provide name for the chapter at the start"
baseinput = f"{RootTwist+Twist1+Twist2}"
Twist3 = getContinuation(baseinstruct,baseinput)
print(f"\n\n\n\n{Twist3}")
baseinstruct = f"give previously written story passed as input, write an ending to the story 300 words ONLY, provide name for the chapter at the start"
baseinput = f"{RootTwist+Twist1+Twist2+Twist3}"
leafTwist = "Thrilling good ending, feel good, entertaining."
Twist4 = getContinuation(baseinstruct,baseinput,leafTwist = leafTwist)
print(f"\n\n\n\n{Twist4}")