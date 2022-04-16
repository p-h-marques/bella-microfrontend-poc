# Prova de Conceito Bella

Essa é uma prova de conceito para simular a comunicação entre o IFrame (o qual conterá a assistente da Bella) e a aplicação principal. Para isso, utilizei uma feature nativa do Javascript, o [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

## Como postar as mensagens?

As mensagens devem ser postadas em dois momentos:

- Quando a Bella estiver processando o conteúdo do usuário;
- Quanto a Bella tiver concluído o processamento.

Essas mensagens comunicam o status da Bella à página pai, conforme exemplos abaixo:

```js
/**
 * Essas funções devem ser chamadas nos
 * momentos citados, passando as mensagens
 * de acordo com um DTO definido
 */
function postMessageEvent() {
  window.parent.postMessage({ key: "isBellaWorking", value: true }, "*");
}

function postMessageSuccess() {
  window.parent.postMessage({ key: "isBellaSuccedded", value: true }, "*");
}
```

## Como consumir as mensagens?

No nomento de criação do componente da Bella, é chamada a função `watchPostedMessages()`, a qual inicia a observação das mensagens postadas, e suas lógicas correspondentes.

```ts
/**
 * Método observa todas as mensagens postadas,
 * e os dados postados são passados
 * para a próxima função
*/
watchPostedMessages() {
  window.addEventListener('message', e => {
    this.updateBellaStatus(e);
  });
}

/**
 * Aqui ocorre a validação da origem da mensagem,
 * e o tratamento para cada tipo de mensagem
 *
 * this.isBellaWorking - Armazena se a Bella está processando o conteúdo
 * this.isBellaSuccedded - Armazena se a Bella concluiu o processamento
*/
updateBellaStatus(message: any): boolean {
  const { data, origin } = message;

  /**
   * Aqui ele compara a origem da mensagem com a constante
   * que armazena a URL do iFrame. Só segue em frente caso
   * a mensagem seja da origem esperada.
  */
  const isMessageFromIframeUrl = this.bellaAppUrl.indexOf(origin) > -1;

  if (!isMessageFromIframeUrl) return false;

  if (data.key === 'isBellaWorking' && typeof data.value === 'boolean') {
    this.isBellaWorking = data.value;
    this.isBellaSuccedded = false;
  }

  if (data.key === 'isBellaSuccedded' && typeof data.value === 'boolean') {
    this.isBellaWorking = false;
    this.isBellaSuccedded = data.value;
  }

  return true;
}
```
