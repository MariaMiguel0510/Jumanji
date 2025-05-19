//verifica se o navegador suporta a API de reconhecimento de fala
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; //língua de reconhecimento 
    recognition.continuous = true; //está constantemente a detetar
    recognition.interimResults = false; //resultado final

    //quando for captado algum som
    recognition.onresult = (event) => {
        //verifica tudo o que foi detetado
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            //se alguma das partes detetada for equivalente a palavra pretendida
            if (event.results[i].isFinal) {

                //transorma esse resultado em texto em minúsculas
                let transcript = event.results[i][0].transcript.trim().toLowerCase();

                //e compara para ver se é o mesmo
                if (transcript.includes('jumanji')) {
                    window.location.href = 'index.html'; //remete para a hompeage/página inicial
                }
            }
        }
    };

    recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
    };

    recognition.start();
} else {
    console.warn('Reconhecimento de voz não suportado neste navegador.');
}
