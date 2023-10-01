import parse, { domToReact, HTMLReactParserOptions } from "html-react-parser";

function useParseWithHTML(text: string = '') {  
    const options: HTMLReactParserOptions = {};
    let data = '';
    if (typeof text === 'string' && text.trim() !== '') {
        data = text.trim();
    }
    return <>{parse(data, options)}</>;
}
function ComponentHasNoData() {
  return null;
}
// @ts-ignore
const HTMLRender = (props) => {
  const data = props.data;
  const parseHtml = useParseWithHTML(data);
  if (data && data !=='') {
    return <>{parseHtml}</>;
  }
  return ComponentHasNoData();
};

export default HTMLRender;
