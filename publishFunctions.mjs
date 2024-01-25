import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/*** data ***/

//          twist0        //
//         /   |   \      //
//  twist1 twist2 twist3  //
//                   |    //
//                twist31 //

// title should be from 1 to 80 chars
// body should be from 40 to 1200 chars

// const twist = {
//     "title": "ROOT3",
//     "body": "BODY"
// };
// const twist2 = {
//     "title": "TWIST1",
//     "body": "BODY"
// };
// /*** /data ***/
export async function finalise(ResponseList){
    const token = process.env.TOKEN;
    for(const res of ResponseList) {
        await axios.post(
            `https://story3.com/api/v2/twists/${res.data.hashId}/publish`,
            null,
            {
                headers: {
                    'x-auth-token': token
                }
            }
        );
    }
}
export async function publishTwist(twist,parent="") {
    // Get api token on https://story3.com/profile
    // please DO NOT COMMIT your token, keep it safe
    // if token was leaked you can refresh it using API endpoint `/api/v2/users/me/api_key`
    const token = process.env.TOKEN;

    // We should create story first. In order to do that we do POST request with root twist data.
    var twistres;
    if(parent.length==0)
    {
        twistres = await axios.post(
            'https://story3.com/api/v2/stories',
            twist,
            {
                headers: {
                    'x-auth-token': token
                }
            }
        );
    }
    else{
        twistres = await axios.post(
            'https://story3.com/api/v2/twists',
            {
                ...twist, // copy data from `twist1`
                "hashParentId": parent
            },
            {
                headers: {
                    'x-auth-token': token
                }
            }
        );
    }
    console.log(twistres)
    return twistres;
}



// const rid = await publishTwist(twist)
//     .catch(e => console.error(e))
// const tid = await publishTwist(twist2,rid)
//     .catch(e => console.error(e))
