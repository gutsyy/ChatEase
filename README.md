# ChatEase

<p align="center">
    <br> English | <a href="./README_ZH.md">中文</a>
</p>

> Helps you manage your conversations with ChatGPT more efficiently

## Prerequisites

1. Open API Key

2. A stable internet connection (so that can manage to keep your account from getting blocked)

## Download and Install

[Release Page](https://github.com/gyuannn/ChatEase/releases/)

## A bit of knowledge

### What are prompts and tokens, and how do they influence your conversation with GPT?

**What are prompts?**

Every conversation you have with ChatGPT can be referred to as a prompt, which is used as context for ChatGPT next response. Every time you ask a new question your conversation history with GPT is sent to it as context for to answer your question. However, there is a limit to the length of a prompt, and tokens are used to determine prompt length

**What are tokens?**

Tokens are used by the ChatGPT model to measure the length of context. In GPT-3.5, there is a limit of 4096 tokens, meaning that if your context is 4000 tokens GPT can only respond with a maximum of 96 tokens.

[Official OpenAI documentation on tokens](https://help.openai.com/en/4936856-what-are-tokens-and-how-to-count-them)

## Basic Features

1. Chatting GPT with code display

2. Prompt Library (beta)

3. Session history storage and search (local)

4. Conversation sharing

5. `Tokens` calculation and expense statistics / En-Zh / Dark mode / Reverse proxy settings / HTTP proxy / Font adjustment, and other basic features

6. Data import and export

## Advanced Features

### Independent settings for each session

All session are persistent, and you can choose the following:

* a message limit in the for the session

* Setting a tokens limit in the prompt for the session

* Setting the temperature for the session

* Setting the model for the session

![chatSettings](./docs/gifs/chatSettings.gif)

### Controlling whether the conversation is in the prompt

By default, this is automatically calculated based on the order of the conversation and set limits, but you can also manually control whether the conversation is added to removed from the prompt.

![Controlling](./docs/gifs/toggleMessageInPrompt.gif)

### Pinning messages in the prompt

![Pin Message](./docs/gifs/pinMessage.gif)

### Using prompt actions in conversations (translation / language correction / optimization)

![Using Prompt Actions](./docs/gifs/useActionsInChat.gif)

### More conversation menu functions

![chatMenu](docs/gifs/chatMenu.gif)

## Roadmap

* [ ] Improved conversational experience (the ultimate goal is to make the structure clearer and make it easier to automatically arrange into notes)

* [ ] Support for GPT4, which is still the `waitlist`

* [ ] A satisfactory Prompt Library module

* [ ] A satisfactory UI/UX

## Contributions

This repository is a personal platform for learning and practice, and the quality of the code may not be very high (it be a mess) when writing this README. The internal design may not be very reasonable, and the use of many functions may be unnecessary due to GPT's rapid advancement. The purpose of developing this application is to improve coding skills and provide unlimited possibilities in conversations with GPT, and also because the plus version is too expensive.

If you want to contribute to the code, please consider it accordingly.
