import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { Button, TextInput, Textarea, NumberInput, Paper, Select, MultiSelect } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { createClientComponentClient  } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { useLocalStorage } from '@mantine/hooks';
import HTMLRender from 'src/components/HtmlRender';

export default function Demo() {
  const supabase = createClientComponentClient ();
  const [document, setDocument] = useState('');
  const [statePersons, setStatePersons] = useState<any>([]);
  const [stateDocuments, setStateDocuments] = useState<any>([]);
  const [selectedPerson, setSelectedPerson] = useState<any>({});
  const [selectedDocument, setSelectedDocument] = useState<any>({});
  const [customDocument, setCustomDocument] = useState<any>('');
  const [nestedDocumentType, setNestedDocumentType] = useState<any>('');
  const [apiKey, setApiKey] = useLocalStorage({ key: 'openai-api-key', defaultValue: 'a' });

  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const model = "gpt-4";
  // const model = "gpt-3.5-turbo";
  useEffect(() => {
    const getData = async () => {
      const { data: persons } = await supabase.from("persons").select();
      // @ts-ignore
      const remappedPersons = persons.map((person:any) => {
        return {
          value: person.email,
          label: person.email,
          details: person.raw_data,
        }
      });
      setStatePersons(remappedPersons);
      const { data: documents } = await supabase.from("documents").select();
      // @ts-ignore
      const remappedDocuments = documents.map((document:any) => {
        return {
          value: document.name,
          label: document.name,
          content: document.content,
          hasDocumentType: document.hasDocumentType,
        }
      });
      remappedDocuments.unshift({value:'custom',label:'Custom Document', content: 'Genereaza un document pe baza acestui prompt:', hasDocumentType: false});
      setStateDocuments(remappedDocuments);
    }
    getData();

  },[]);
  const form = useForm();

  function handleSubmit(values:any) {
    setLoading(true);   

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ "messages": [{ "role": "system", "content": "Sunteți un bot AI care poate completa documentele cu detalii despre clienți sau poate genera un document pe baza solicitării. Vă voi oferi informații despre Client și trebuie să completați documentul cu detaliile clientului." }, { "role": "user", "content": "Customer Information: " + JSON.stringify(selectedPerson) }, { "role": "user", "content": document }, { "role": "system", "content": "Înfrumusețați răspunsul cu elemente HTML si style ca sa arate bine, nu returna o intreaga pagina html cu body/head, returneaza DOAR documentul. Adauga randuri/spatii unde e necesar. Pune titlul documentul pe centru. Adauga campul pentru Data si Semnatura daca e necesar. Daca documentul contine loc pentru Data sau Semnatura, acestea trebuie sa fie pozitionate jos stanga si dreapta" }, { "role": "system", "content": "Dacă nu a fost furnizată o cerere/document, atunci trebuie să generați un document pe baza informatiilor furnizate. Nu include toate detaliile care le ai despre client daca nu este necesar, ca exemplu, nu e nevoie sa indici detaliile pasaport daca deja ai indicat detaliile despre buletin. Daca documentul nu continte campuri pentru anumite informatii despre client, atunci NU improviza si nu le adauga in document fara necesitate. Highlight with bold my personal details in the document." }], "model": model, "temperature": 1, "presence_penalty": 0, "top_p": 1, "frequency_penalty": 0, "stream": false })
    })
      .then((response) => response.json())
      .then((data) => {
        setResponse(data.choices[0].message.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleDocumentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setDocument(event.target.value);
  }

  return (
    <div className='flex flex-col w-full'>
      <div className="form flex justify-center flex-1 w-full">
        <form onSubmit={form.onSubmit((values) => {
          handleSubmit(values);
        })} className="w-full p-4">
          {/* dropdown with persons */}
          <TextInput value={apiKey} label="OpenAI API Key" id="openai-api-key" className="mb-4" onChange={(event) => {
            setApiKey(event.currentTarget.value);
          }}/>
          <Select data={statePersons} label="Persons" id="persons" className="mb-4" onChange={(value) => {
            const person = statePersons.find((person:any) => person.value === value);
            setSelectedPerson(person);
          }}/>
          <Select searchable  data={stateDocuments} label="Templates" id="existing-document" className="mb-4" onChange={(value) => {
            const document = stateDocuments.find((document:any) => document.value === value);
            console.log('document',document)
            setSelectedDocument(document);
            setDocument(document.content);
          }}/>
          {selectedDocument.value ==='custom' && <Textarea minRows={5} label="Custom Document" id="custom-document" className="mb-4" onChange={(event) => {
            setCustomDocument(event.currentTarget.value);
            console.log('customDocument',event.currentTarget.value);
            setDocument('Genereaza un document pe baza acestui prompt: '+event.currentTarget.value);
          } }/>}
          {selectedDocument?.hasDocumentType &&  <TextInput label="Document" id="document-type" className="mb-4" onChange={(event) => {
            setNestedDocumentType(event.currentTarget.value);
          }}/>}
          <Button variant="filled" type="submit" loading={loading} loaderProps={{ type: 'dots' }}>
            Submit
          </Button>
          <br/>
          {/* {JSON.stringify(selectedPerson)} */}
                     
        </form>

        {/* <Textarea label="Document" className="flex-1 p-4" value={document} onChange={handleDocumentChange} minRows={30} autosize/> */}

      </div>
      <div className=''>
      <Paper shadow="xl" p="xl" withBorder 
        className="p-8 mx-4 my-8 md:mx-20 md:my-16"
      >
        {/* <ReactMarkdown>{response}</ReactMarkdown> */}
        <HTMLRender data={response || ''}/>
      </Paper>
      </div>
    </div>
  );
}