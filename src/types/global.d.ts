declare module 'isomorphic-dompurify' {
  interface Config {
    // Опции конфигурации DOMPurify (если требуются)
  }

  interface DOMPurify {
    sanitize(dirty: string, config?: Config): string;
  }

  const isomorphicDOMPurify: DOMPurify;

  export default isomorphicDOMPurify;
}
