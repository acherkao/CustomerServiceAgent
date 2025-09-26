# IBM Customer Assist Platform

![Demo Screenshot](/docs/imgs/generic_agent_dashboard.png)

## Change Log
* 2/6/25: With the sunset of BAM, remove BAM endpoint option. Note: ignore lingering references to BAM throughout codebase. These are irrelevant. The app runs on Watsonx now).
* 9/18/24: In addition to BAM endpoint, provide updated option for Watsonx endpoint.

## Table of Contents

- [Summary](#summary)
- [Authors](#authors)
- [Instructions](#instructions)
  - [Environment Setup](#environment-setup)
  - [Local Development](#local-development)
    - [NextJS Setup](#nextjs-setup)
    - [STT Setup](#stt-setup)
  - [Choose Use Case](#choose-use-case)
  - [Speech to Text Pipeline](#speech-to-text-pipeline)
    - [Craft a Use Case](#craft-a-use-case)
    - [Record the Transcript](#record-the-transcript)
    - [Run the Script](#run-the-script)
  - [Timestamp the Functionality](#timestamp-the-functionality)
  - [Run the Application Locally](#run-the-application-locally)
  - [Customize UI](#customize-ui)
  - [Customize watsonx.ai Calls](#customize-ui)
- [Troubleshooting](#troubleshooting)
- [Metadata](#metadata)

**DISCLAIMER**: For the purposes of this demo, some of the components that "appear" generative are either not real-time or hard-coded. Note that in a pilot with the customer, hard-coded components can be fully built out given our prompt templates and utility files from the portions that *are* built out in this demo. The distinction in the out-of-the-box demos are as follows:

1) Real-time components: follow-up action item extraction, sentiment analysis of past call transcripts, classification of topic of past transcripts, Discovery knowledge lookup and summarization of relevant info.

2) AI model run previously but results hard-coded in: middle sentiment analysis graph (NLU), STT of phone call.

3) Hard-coded mimicked generative AI components: Recommended actions, call template checklist, bolding phrases in call transcript, slot filling of email template.

---

## Summary

This is the codebase for `IBM Customer Assist Platform`, an FSM asset developed by Client Engineering. The asset showcases several Watson and Watsonx services working together to help augment the workflow of a contact center agent. This demo was developed using [this](https://github.ibm.com/skol-assets/watsonx-ai-agent-assist) reusable asset. All code can be found here along with descriptions of how the codebase works.

<ins>IBM Technologies Used</ins>:

1. `watsonx.ai`
2. `Watson Discovery`
3. `Watson Speech to Text`
4. `Watson Natural Language Understanding`
5. `Carbon Components Framework`

<ins>Business Value</ins>: Increase teammate efficiency in call centers and physical branches. Increase customer satisfaction. Increase product penetration and faster mean time to resolution.

<ins>Call Transcript Use Case (Financial Services Market)</ins>: Paul Kelly is calling General Bank regarding frustration over overdraft fees and credit card debt at another bank. The agent assist dashboard gives the agent insights via watsonx to be able to effectively conduct the client call. Generative AI use cases included are sentiment analysis, topic classification, transcript summarization, recommended actions, and action item extraction.

<ins>IBM Technologies Used</ins>: Watsonx.ai, Watson Discovery, STT, Watson NLU, Carbon UI Framework.

<ins>Architecture</ins>
![Demo Screenshot](/docs/imgs/solution_architecture.png)

## Authors

Reusable Asset Authors

- **David Levy** (Lead), Client Engineering Technology Engineer, FSM
- **Isaac Ke** (Lead), Client Engineering AI Engineer, FSM
- **Shay Zhao**, Client Engineering AI Engineer, FSM
- **Arvin Lin**, Client Engineering Technology Engineer, FSM
- **Austin Simmons**, Client Engineering AI Engineer, FSM
- **Krysten Thompson**, Client Engineering AI Engineer, FSM
- **Christy Jacob**, Client Engineering AI Engineer, FSM

Original Asset Authors

- **David Levy**, Client Engineering Technology Engineer, FSM
- **Isaac Ke**, Client Engineering AI Engineer, FSM

## Instructions

#### Environment Setup

To run this demo, you must requisition the following cloud offerings in [TechZone](https://techzone.ibm.com/dashboard). Below there are links to the (_as of the time of this writing_) offerings available to you in TechZone. If any are unavailable, use the search bar on the TechZone dashboard for an environment that provides the service.

_IBM Services needed_

- Watsonx.ai Instance
  - <a href="https://techzone.ibm.com/my/reservations/create/64b14bbfe65f4d00161a58df" target="_blank">Watsonx.ai Saas</a>
- Watson Discovery
  - <a href="https://techzone.ibm.com/my/reservations/create/63c165a67783cf0018bfb937" target="_blank">Watson Discovery Plus</a>
- Watson NLU
  - <a href="https://techzone.ibm.com/my/reservations/create/6334adf39352550017b1d9b0" target="_blank">Watson Natural Language Understanding (SaaS)</a>
- Watson STT
  - <a href="https://techzone.ibm.com/my/reservations/create/633c7532095e0b0017f9dfdf" target="_blank">Speech to Text Plus (SaaS)</a>

_Needed on your workstation_

- Node.js v18 - v20, ideally v20. Before downloading node.js, we strongly recommend you run `node -v` to see 1) if you have node.js installed already, and 2) what version you have installed.

- Please see additional tips, instructions, and node.js troubleshooting info <a href="https://github.ibm.com/skol-assets/watsonx-ai-Customer-Agent-Assistant-FSM/wiki/Node.js-Install-Tips-and-Troubleshooting" target="_blank">here</a>.

---

#### Local Development

Clone repository to your local machine

```sh
git clone https://github.ibm.com/skol-assets/watsonx-ai-Customer-Agent-Assistant-FSM.git
```

Install root dependencies

```sh
cd watsonx-ai-Customer-Agent-Assistant-FSM
npm install
```

Run setup script (will create .env.local and stt/.env, and install dependencies for the stt pipeline)

```sh
npm run setup
```

##### NextJS Setup

Populate the `.env.local` file with the env variables from your services:

```sh
NEXT_PUBLIC_WATSONX_TYPE=GA

WATSONX_GA_ENDPOINT='https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29'
IBM_API_KEY=<IAM API key from cloud.ibm>
PROJECT_ID=<Project ID from watsonx>

# DISCOVERY
WATSON_DISCOVERY_KEY =
WATSON_DISCOVERY_URL =
WATSON_DISCOVERY_PROJECTID =
WATSON_DISCOVERY_VERSION='2022-08-01'

# Header Branding
NEXT_PUBLIC_BRANDING_NAME='IBM'
NEXT_PUBLIC_APPLICATION_NAME='Agent Assist'

# Sentiment Analysis labels, must match the env in stt/.env
NEXT_PUBLIC_TRANSCRIPT_SPEAKER_ONE='Agent'
NEXT_PUBLIC_TRANSCRIPT_SPEAKER_TWO='Customer'

# Use 'banking' for Agent Assist and 'wealth' for Wealth Advisor Assist, and 'insurance' for the Insurance use case.
#--------------- IF YOU ARE MAKING A CUSTOM DEMO, LEAVE THIS BLANK ---------------------------#
NEXT_PUBLIC_DEMO_TYPE='banking'

# Audio file env changed 2024-03-07 14:43:30
NEXT_PUBLIC_AUDIO_FILE='FSM-Agent-Assist-Combined.wav'
```

##### STT Setup

Populate `stt/.env` file with the variables from your services:

```sh
WATSON_STT_API_KEY=
WATSON_STT_URL=

WATSON_NLU_API_KEY=
WATSON_NLU_URL=

# TAG FOR TRANSCRIPT, MUST MATCH NEXTJS ENVs
TRANSCRIPT_SPEAKER_ONE='Agent'
TRANSCRIPT_SPEAKER_TWO='Customer'
```

---

#### Choose Use Case

Provided in the repo are three prebuilt use cases to demo:
These are:

- _Banking_
- _Wealth_
- _Insurance_

The repository is set up for the default **Banking Agent Assist** use case without any customization.

Before you can demo the asset, you must upload the documents located in `docs/Discovery/<Use-Case>` to the Watson Discovery instance you have requisitioned in [Environment Setup](#environment-setup) above.

To switch between the three use cases (banking, wealth, and insurance) first you must update the `.env.local` file located in the root of this project to one of the following values:

```.env
NEXT_PUBLIC_DEMO_TYPE='banking'
or
NEXT_PUBLIC_DEMO_TYPE='wealth'
or
NEXT_PUBLIC_DEMO_TYPE='insurance'
```

Next you must run the `update` script to update the files necessary for sentiment analysis, follow-up actions ect.

```sh
npm run update
```

It will give you this message, and then say `yes`

```
-------------------------------------------------------------------------------------------------------------
This update should be done once you have updated your transcribed_data.json file to be accurate to the script OR
you are changing your use case to one of the three prebuilt use cases provided in this asset.
Only files that start with 'transcribed_' can be used to update the utterance, nlu, and radar graph files.
Are you sure you want to run this update?
-------------------------------------------------------------------------------------------------------------

Are you sure you want to continue? (Yes/No):

```

It will then ask you to choose from one of the prebuilt use-case transcription files:

```
Transcribed data files in directory:
0. transcribed_data.json
1. transcribed_data_banking.json
2. transcribed_data_insurance.json
3. transcribed_data_wealth.json
Enter the number of the file you want to select:
```

Select the file that is appended with the use case you have set your `DEMO_TYPE` env to ie:

.env.local:

```
NEXT_PUBLIC_DEMO_TYPE='insurance'
```

you would choose `2`:

```
Transcribed data files in directory:
0. transcribed_data.json
1. transcribed_data_banking.json
2. transcribed_data_insurance.json
3. transcribed_data_wealth.json
Enter the number of the file you want to select: 2

```

At this is point you can now run the start up script and demo the asset locally!

```
npm run dev
```

---

### Speech to Text Pipeline

---

_If the intention is to demo the generic banking conversation already provided in this repo, you do not need to complete the following actions. This is only if you are creating a new use case! If you are not creating a new use case **skip the next section!**_

---

This pipeline will take a recording of a conversation between two speakers, create a transcript, an utterance file, run sentiment analysis on each utterance, and convert that into a format to be rendered by the Carbon Radar Graph component in the application.

#### Craft a Use Case

Craft a use case and conversation that will highlight the features presented in this demo. The shorter the better! Features to keep in mind:

- Watson Discovery Lookup and Summarization of response
  - Present information to the agent in an easy to digest format that they will use to upsell/help the customer. Accomplish this by recognizing a product may be useful to mention, and have it populate the knowledge look up tile before the agent references the product in the transcript.
- Follow-up Action Items
  - Over the course of the conversation, give the Agent lines that will populate the Follow-up Action Item list. ie. Send the customer an follow up email, schedule a call for a later date, have someone contact the customer etc.
- Sentiment Analysis
  - A good idea for a use case is to have the customer call due to an issue they need resolved, one in which the first few utterances by the customer would be registered in the neutral/negative sentiment value range. Over the course of the conversation, ensure that the customer's sentiment moves and then stays in the positive range, indicating that the agent was able to use this tool to help ensure a happy outcome

#### Record the Transcript

**Important: the STT parameters are expecting a call between two people, providing a recording of just one person will produce poor results.**

If using a MacOS workstation, we are provided with the application GarageBand. This is a great tool to use to record the transcript. Write out a script between Agent and Customer, and have 2 people on your team record. Benefits of using GarageBand is the high fidelity of the audio, and the ability to add effects such as `telephone` on each voice. It is not necessary of course, but it can save some headaches, and lift the quality of the demo during the presentation.

Once the recording is complete, save the file as a `.wav` file and place it in the `audio_files/` folder in the root of this project, which will replace the generic transcript provided (that audio file has a backup in the same folder if you want to revert.)

---

#### Run the Script

After all previous steps have been completed, you have a recorded demo in `audio_files/`, you can now run the pipeline script:

```
npm run pipeline
```

Select the file which you want to run the pipeline with:

```
Files in directory:
0. Custom-Transcript.wav
1. FSM-AA-Insurance-Combined.wav
2. FSM-AA-Wealth-Combined.wav
3. FSM-Agent-Assist-Combined.wav
Enter the number of the file you want to select: 0
```

The output in your console should indicate which part of the pipeline is running, and if there are any errors. After the pipeline has completed you will have several new files in `stt/`

```sh
├── nlu_data
│   ├── backup
│   │   └── sentiment_data.json.bak
│   └── sentiment_data.json # SENTIMENT DATA JSON
├── radar_data
│   ├── backup
│   │   └── radar_data.json.bak
│   └── radar_data.json # RADAR GRAPH DATA JSON
├── stt_data
│   ├── backup
│   │   ├── combined_stt_output.json.bak
│   │   ├── transcribed_data.json.bak
│   │   └── utterance.json.bak
│   ├── combined_stt_output.json # RESPONSE FROM WATSON STT
│   ├── transcribed_data.json # CONVERTED STT DATA FOR RENDER
│   └── utterance.json # UTTERANCE FILE
```

When you run the script, all previous versions of these files will be placed in the `backup` folder in their respective directory, but only one copy of the backup exists (it will replace your previous backup)

This will be the first pass, as without a custom Speech to Text model, most likely the transcript will not be 100% correct! If that is the case, the `stt/stt_data/transcribed_data.json` will have to be manually edited and compared to the script that has been recorded. A tedious undertaking that can only be avoided by creating a custom stt model.

Once you have updated your transcibed_data.json to be accurate to the script, you must run the `update` script to update the utterance, sentiment, and radar graph json files.

```
npm run update
```

You will be shown the following message, write `yes`

```
-------------------------------------------------------------------------------------------------------------
This update should be done once you have updated your transcribed_data.json file to be accurate to the script OR
you are changing your use case to one of the three prebuilt use cases provided in this asset.
Only files that start with 'transcribed_' can be used to update the utterance, nlu, and radar graph files.
Are you sure you want to run this update?
-------------------------------------------------------------------------------------------------------------

Are you sure you want to continue? (Yes/No): yes
```

Next you will be given a list of available `transcribed_data.json` files to choose from, choose option `0`:

```
Transcribed data files in directory:
0. transcribed_data.json
1. transcribed_data_banking.json
2. transcribed_data_insurance.json
3. transcribed_data_wealth.json
Enter the number of the file you want to select: 0
```

Now that the STT/NLU pipeline has been completed, all that is left is to update the `demo_script.json` to your liking for the custom use case you have built!

---

#### Timestamp the Functionality

For all hard coded actions (knowledge lookup, follow-up actions, etc), the application follows a json script that can be found in `src/data/demo_script.json`

The format is such:

```json
{
  "functionality_a": [
    {
      "item_specific_function_a": "item_specific_name",
      "timestamp": "number in seconds"
    },
    {
      "item_specific_function_a": "item_specific_name",
      "timestamp": "number in seconds"
    },
    ...
  ]
}
```

For example, if in your script, you have a `follow-up action` that should populate the list at the 70 second mark, you would update the property `followup_actions` and add an item like so:

```json
  "followup_actions": [
    {
      "timestamp": 70,
      "value": "This is my new follow up action"
    },
    ...
  ],
```

For `knowledge lookup`, there is the ability to make multiple Watson Discovery queries, and have multiple cards populate at a specific timestamp, so the property `knowledge_lookup` can look like this:

```json
  "knowledge_lookup": [
    {
      "timestamp": 24,
      "query": [
        "What is the General Plus Checking account?"
      ],
      "queryTerm": "General Plus Checking",
      "tag": [
        "General Plus Checking"
      ]
    },
    {
      "timestamp": 66,
      "query": [
        "What is the General Bank Prime Power Credit Card?",
        "What is the General Bank Cash Flex Credit Card?"
      ],
      "queryTerm": "General Bank credit cards",
      "tag": [
        "General Bank Prime Power Credit Card",
        "General Bank Cash Flex Credit Card"
      ]
    }
  ],

```

For the lookup at `timestamp` 24, we have a single query to Watson Discovery, which will populate one card. But for `timestamp` 66, we have two queries, which we populate in a list.

For the property `contact_history_data`, this is where all previous transcripts will be placed and the objects within the list will be used as a basis for the watsonx.ai summarization, classification, and sentiment analysis found in the Contact History tile. The format for each item is such:

```json
    {
      "date": "7/01/2023",
      "tag": "Phone Call",
      "review": "",
      "transcript": [
        {
          "type": "Agent",
          "message": "Good afternoon. Thank you for calling General Bank. My name is Lisa. How can I assist you today?"
        },
        {
          "type": "Customer",
          "message": "Hi Lisa, I need to dispute an unwanted withdrawal on my savings account. I'm really upset about it."
        },
        {
          "type": "Agent",
          "message": "I'm sorry to hear that you're upset. I'll do my best to help you with your withdrawal dispute. Could you please provide your account number or social security number for verification?"
        },
        {
          "type": "Customer",
          "message": "It's 1234567890."
        },
        ...
      ]
    },

```

This item's object will be automatically converted to be rendered as well as the stringified for the watsonx.ai calls, so it must be in this format.

The property `demo_transcript` is the json transcript of the call that is being played during the demo. This object is used for the summarization that populates the modals in the Quick Send tile.

---

#### Run the Application Locally

Now is the time to check that everything works! From the root of the project run:

```
npm run dev
```

After the project compiles, it will be available in your browser at `http://localhost:3000`

---

#### Customize UI

_Styling_

For the primary and secondary colors of the application, all that needs to be altered can be found in `src/pages/styles/variables.scss`

```scss
$primary-color: rgba(38, 38, 38, 1);
$secondary-color: rgba(255, 255, 255, 1);
```

Update these variables to change the primary and secondary colors of the UI.

---

#### Customize `watsonx.ai` Calls

For the watsonx.ai calls such as summarization, classification, followup-actions etc., the functionality to customize the parameters (model_id, instructions, examples etc) is found in `src/pages/components/utilities/watsonxUtils.ts`

For example, when checking to see if an agent's utterance necessitates a followup-action, in `src/pages/components/FollowupActionList/FollowupActionList.tsx` a call will be made to `watsonx.ai`:

```ts
const followupActionOptions = watsonXOptions('followupAction', combinedText);

const followupActionResponse = await axios.post<WatsonxResponse>(
  `/api/${API_VERSION}`,
  followupActionOptions
);
```

Before we make the call to the watsonx.ai api endpoint, we create an object with all the parameters including examples, model_id and others using the `watsonXOptions` function.

To customize that returned object (which controls the type of call it is), you must update the **`optionsMap`** variable found in `src/pages/components/utilities/watsonxUtils.ts`

```ts
yourCustomizedCall: {
  instruction:
    'This is where you write some instructions to give to the llm',
  input_prefix: 'Input:',
  output_prefix: 'Output:',
  stop_sequences: ['\nInput:', 'Input:'],
  examples: [
    {
      input:
        "One of your example inputs",
      output: 'One of you example outputs',
    },
    ... examples
    {
      input:
        'Another one of your example inputs',
      output: 'Another example output',
    },
  ],
  input: [input],
  model_id: 'meta-llama/llama-2-13b-chat',
  repetition_penalty: 1,
  decoding_method: 'greedy',
  min_new_tokens: 1,
  max_new_tokens: 25,
},
```

For the example above, the new custom `watsonx.ai` call will look like this:

_The name of the custom call options field you just created, shown above, will be the first arg in the `watsonXOptions` function_

```ts
const yourCustomizedCallOptions = watsonXOptions('yourCustomizedCall', data);

// that variable above will now be the body of your post request
const yourCustomziedCallResponse = await axios.post<WatsonxResponse>(
  `/api/${API_VERSION}`,
  yourCustomizedCallOptions
);
```
## Troubleshooting
 A common error you might get is:

 ```
 API resolved without sending a response for /api/watsonXGA, this may result in stalled requests.
 ```
 
To resolve, first try stopping the application and re-running it. If the error persists, double check all your environment variables are correct. Lastly, the error might be due to the code calling a model that has since been depracated. 
 
The catalog of models available in Watsonx.ai is constantly changing, with new models being added and old ones being depracated. As a result, the default models used in this repo may no longer be available by the time you run this asset. If you are getting errors in the calls to `watsonx.ai`, check the `model_id` fields in the `src/pages/components/utilities/watsonxUtils.ts` file and ensure that the models being referenced are still available in Watsonx.ai (check the catalog of models in the Watsonx.ai prompt lab).

## Metadata

<ins>Adapted From</ins>: A demo that was built for a IBM-Truist top-to-top meeting presented to Arvind, Bill Rogers (Truist CEO) and the Truist C-suite can be found [here](https://github.ibm.com/ce-truist-innovation/agent-assist-demo.git).

<ins>IBM Technologies Used:</ins>

1. `watsonx.ai`
2. `Watson Discovery`
3. `Watson Speech to Text`
4. `Watson Natural Language Understanding`
5. `Carbon Components Framework`

<ins>Date Initially Published</ins>: March 29, 2024

<ins>Original Asset Tech/Project Lead</ins>: **Isaac Ke**, Client Engineering AI Engineer, FSM

<ins>Reusable Asset Lead:</ins> **David Levy**, Client Engineering Technology Engineer, FSM
