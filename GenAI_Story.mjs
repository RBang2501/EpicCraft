import fetch from 'node-fetch';
import { publishTwist, finalise} from './publishFunctions.mjs';

function getPayloadLink()
{
    return "https://television-doing-pharmacies-sucking.trycloudflare.com/v1/chat/completions";
}
function getLoadModelLink(){
    return "https://television-doing-pharmacies-sucking.trycloudflare.com/v1/internal/model/load";
}

const baseinstruct = "Write a Chapters of story about The Last Librarian of Alexandria start the story with input . Chapter length 150 words only";
const baseinput = 'Dust motes danced in the sunbeams piercing through the vaulted ceiling. As the sole custodian of the legendary Library of Alexandria, I navigated towering shelves laden with scrolls whispering tales of forgotten empires and hidden knowledge. But shadows lurk in the labyrinthine stacks, and a forbidden tome beckons with promises of power and peril. (Image of the Last Librarian of Alexandria surrounded by ancient scrolls)';











const headers = {
    "Content-Type": "application/json"
};


async function loadModel() {
    const url = getLoadModelLink()

    const data = {
        "model_name": "TheBloke_MythoMax-L2-13B-GPTQ_gptq-4bit-32g-actorder_True",
        "args": {},
        "settings": {}
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
        agent: false, // Equivalent to verify=False in Python
    });

    console.log(response);
}

async function getTwist(baseinstruct, baseinput, overloadalpaca = "") {
    let inputtoalpaca = `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.### Instruction:\nInstruction${baseinstruct}\n### Input:\nInput${baseinput}\n### Response:`;

    if (overloadalpaca !== "") {
        inputtoalpaca = overloadalpaca;
    }

    const payload = {
        "messages": [
            {
                "role": "user",
                "content": inputtoalpaca
            }
        ],
        "mode": "instruct",
        "instruction_template": "Alpaca"
    };

    const payurl = getPayloadLink()
    const response = await fetch(payurl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        agent: false,
    });

    const jsonResponse = await response.json();
    if(jsonResponse.choices[0].message.content.length>1200)
    {
        return await getSummary(jsonResponse.choices[0].message.content)
    }
    return jsonResponse.choices[0].message.content;
}
async function getSummary(baseinput) {
    const baseinstruct="Summarize the input"
    const inputtoalpaca = `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.### Instruction:\nInstruction${baseinstruct}\n### Input:\nInput${baseinput}\n### Response:`;

    const payload = {
        "messages": [
            {
                "role": "user",
                "content": inputtoalpaca
            }
        ],
        "mode": "instruct",
        "instruction_template": "Alpaca"
    };

    const payurl = getPayloadLink()
    const response = await fetch(payurl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        agent: false,
    });

    const jsonResponse = await response.json();
    if(jsonResponse.choices[0].message.content.length>1200)
    {
        return await getSummary(baseinstruct,baseinput)
    }
    return jsonResponse.choices[0].message.content;
}
async function getTitle(baseinput) {
    const baseinstruct="Give short title for the input"
    const inputtoalpaca = `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.### Instruction:\nInstruction${baseinstruct}\n### Input:\nInput${baseinput}\n### Response:`;

    const payload = {
        "messages": [
            {
                "role": "user",
                "content": inputtoalpaca
            }
        ],
        "mode": "instruct",
        "instruction_template": "Alpaca"
    };

    const payurl = getPayloadLink()
    const response = await fetch(payurl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        agent: false,
    });

    const jsonResponse = await response.json();
    if(jsonResponse.choices[0].message.content.length>80)
    {
        return await getSummary(baseinstruct,baseinput)
    }
    return jsonResponse.choices[0].message.content;
}

async function getContinuation(baseinstruct, baseinput, overloadalpaca = "", leafTwist = "") {
    if (leafTwist !== "") {
        baseinstruct = baseinstruct + ` and write a fitting ending for the story such that it is ${leafTwist}`;
    }

    const inputtoalpaca = `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.### Instruction:\nInstruction${baseinstruct}\n### Input:\nInput${baseinput}\n### Response:`;

    const payload = {
        "messages": [
            {
                "role": "user",
                "content": inputtoalpaca
            }
        ],
        "mode": "instruct",
        "instruction_template": "Alpaca"
    };

    const payurl = getPayloadLink()
    const response = await fetch(payurl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        agent: false,
    });

    const jsonResponse = await response.json();
    if(jsonResponse.choices[0].message.content.length>1200)
    {
        return await getSummary(baseinput=jsonResponse.choices[0].message.content);
    }
    return jsonResponse.choices[0].message.content;
}

async function Publish(title, body, id="")
{
    const twist = {
        "monetization_option": "free",
        "title": title,
        "body": body
    };
    if(id.length == 0)
    {return await publishTwist(twist)
    .catch(e => console.error(e))}
    
    return await publishTwist(twist,id)
    .catch(e => console.error(e))
}

// Sample usage


//!!!!!!!!!!!!!!RUN AT START THEN COMMENT!!!!!!!!!!!!!
// await loadModel();

(async () => {
    var ResponseList = []
    var RootTwist = await getTwist(baseinstruct, baseinput);
    var title = await getTitle(RootTwist);
    console.log(`${title} \n ${RootTwist}`);
    const id0 = await Publish(title, RootTwist);
    ResponseList.push(id0);

    const Twist1 = await getContinuation("given previously written chapters passed as input, Write NEXT 1 Chapter of story within 150 words ONLY", RootTwist);
    title = await getTitle(Twist1);
    console.log(`\n\n\n${title}\n${Twist1}`);
    const id1 = await Publish(title, Twist1,id0.data.hashId);
    ResponseList.push(id1);

    // const Twist2 = await getContinuation("given previously written chapter passed as input, Write NEXT 1 Chapter of story within 150 words ONLY", RootTwist + Twist1);
    // title = await getTitle(Twist2);
    // console.log(`\n\n\n${title}\n${Twist2}`);
    // const id2 = await Publish(title, Twist2,id1.data.hashId);
    // ResponseList.push(id2);

    // const Twist3 = await getContinuation("given previously written chapter passed as input, Write NEXT 1 Chapter of story within 150 words ONLY", RootTwist + Twist1 + Twist2);
    // title = await getTitle(Twist3);
    // console.log(`\n\n\n${title}\n${Twist3}`);
    // const id3 = await Publish(title, Twist3,id2.data.hashId);
    // ResponseList.push(id3);

    const leafTwist = "Thrilling good ending, feel good, entertaining.";
    var Twist4 = await getContinuation("given previously written story passed as input, write an ending to the story within 150 words ONLY", RootTwist, leafTwist);
    title = await getTitle(Twist4)
    console.log(`\n\n\n${title}\n${Twist4}`);
    const id4 = await Publish(title, Twist4,id1.data.hashId);
    ResponseList.push(id4);
    
    finalise(ResponseList)
    
})();
/*
const twist = {
    "title": "ROOT5",
    "body": "BODY"
};
const twist2 = {
    "title": "TWIST1",
    "body": "BODY"
};
const rid = await publishTwist(twist)
    .catch(e => console.error(e))
const tid = await publishTwist(twist2,rid)
    .catch(e => console.error(e))
*/