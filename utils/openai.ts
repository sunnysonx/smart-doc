type FormData = {
  firstname: string;
  lastname: string;
  cnp: string;
  dateOfBirth: string;
};

type OpenAIResponse = {
  data: {
    choices: {
      text: string;
    }[];
  }[];
};

export async function getOpenAIResponse(
  formData: FormData,
  textAreaContent: string
): Promise<string> {
  const prompt = `Dear ${formData.firstname} ${formData.lastname},\n\n${textAreaContent}\n\nSincerely,\n\n`;
  const data = {
    prompt,
    max_tokens: 100,
    temperature: 0.5,
    n: 1,
    stop: '\n\n',
  };
  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(data),
  });
  const responseData: OpenAIResponse = await response.json();
  // @ts-ignore
  return responseData.data.choices[0].text;
}