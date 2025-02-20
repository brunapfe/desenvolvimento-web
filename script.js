const firebaseConfig = {
    apiKey: "AIzaSyC6OQWrbb0hDqUcufGhw2I8OqO4z9vUfjw",
    authDomain: "cadastro-2a1b2.firebaseapp.com",
    projectId: "cadastro-2a1b2",
    storageBucket: "cadastro-2a1b2.firebasestorage.app",
    messagingSenderId: "933178316738",
    appId: "1:933178316738:web:c9d3b46cb9bdb905ee685b"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

let atividades = [];
let horasPorCategoria = { Ensino: 0, Extensao: 0, Pesquisa: 0 };
let limitesPorAtividade = {
    // Atividades de Ensino
    "Estágio Extracurricular": { limite: 40, aproveitamento: 0.7 },
    "Monitoria": { limite: 40, aproveitamento: 0.7 },
    "Concursos e campeonatos de atividades acadêmicas": { limite: 50, aproveitamento: 0.7 },
    "Presença comprovada a defesas de TCC do curso de Engenharia de Computação": { limite: 3, aproveitamento: 0.5 },
    "Cursos Profissionalizantes Específicos na área": { limite: 40, aproveitamento: 0.8 },
    "Cursos Profissionalizantes em geral": { limite: 10, aproveitamento: 0.2 },

    // Atividades de Extensão
    "Projeto de extensão": { limite: 40, aproveitamento: 0.1 },
    "Atividades culturais": { limite: 5, aproveitamento: 0.8 },
    "Visitas Técnicas": { limite: 40, aproveitamento: 1.0 },
    "Visitas a Feiras e Exposições": { limite: 5, aproveitamento: 0.2 },
    "Cursos de Idiomas": { limite: 20, aproveitamento: 0.6 },
    "Palestras, Seminários e Congressos Extensionistas (ouvinte)": { limite: 10, aproveitamento: 0.8 },
    "Palestras, Seminários e Congressos Extensionistas (apresentador)": { limite: 15, aproveitamento: 1.0 },
    "Projeto Empresa Júnior": { limite: 20, aproveitamento: 0.2 },

    // Atividades de Pesquisa
    "Iniciação Científica": { limite: 40, aproveitamento: 0.8 },
    "Publicação de artigos em periódicos científicos": { limite: 10, aproveitamento: 1.0, porPublicacao: true },
    "Publicação de artigos completos em anais de congressos": { limite: 7, aproveitamento: 1.0, porPublicacao: true },
    "Publicação de capítulo de livro": { limite: 7, aproveitamento: 1.0, porPublicacao: true },
    "Publicação de resumos de artigos em anais": { limite: 5, aproveitamento: 1.0, porPublicacao: true },
    "Registro de patentes como auto/coautor": { limite: 40, aproveitamento: 1.0, porPublicacao: true },
    "Premiação resultante de pesquisa científica": { limite: 10, aproveitamento: 1.0, porPublicacao: true },
    "Colaborador em atividades como Seminários e Congressos": { limite: 10, aproveitamento: 1.0 },
    "Palestras, Seminários e Congressos de Pesquisa (ouvinte)": { limite: 10, aproveitamento: 0.8 },
    "Palestras, Seminários e Congressos de Pesquisa (apresentador)": { limite: 15, aproveitamento: 1.0 }
};
let horasPorAtividade = {};

function atualizarTipos() {
    let categoria = document.getElementById("categoria").value;
    let tipo = document.getElementById("tipo");
    tipo.innerHTML = "";

    let tiposEnsino = [
        "Estágio Extracurricular", "Monitoria", "Concursos e campeonatos de atividades acadêmicas",
        "Presença comprovada a defesas de TCC do curso de Engenharia de Computação",
        "Cursos Profissionalizantes Específicos na área", "Cursos Profissionalizantes em geral"
    ];

    let tiposExtensao = Object.keys(limitesPorAtividade).filter(
        key => !tiposEnsino.includes(key) && ![
            "Iniciação Científica", "Publicação de artigos em periódicos científicos",
            "Publicação de artigos completos em anais de congressos", "Publicação de capítulo de livro",
            "Publicação de resumos de artigos em anais", "Registro de patentes como auto/coautor",
            "Premiação resultante de pesquisa científica", "Colaborador em atividades como Seminários e Congressos",
            "Palestras, Seminários e Congressos de Pesquisa (ouvinte)", "Palestras, Seminários e Congressos de Pesquisa (apresentador)"
        ].includes(key)
    );

    let tiposPesquisa = [
        "Iniciação Científica", "Publicação de artigos em periódicos científicos",
        "Publicação de artigos completos em anais de congressos", "Publicação de capítulo de livro",
        "Publicação de resumos de artigos em anais", "Registro de patentes como auto/coautor",
        "Premiação resultante de pesquisa científica", "Colaborador em atividades como Seminários e Congressos",
        "Palestras, Seminários e Congressos de Pesquisa (ouvinte)", "Palestras, Seminários e Congressos de Pesquisa (apresentador)"
    ];

    let tipos = categoria === "Extensao" ? tiposExtensao : 
                categoria === "Ensino" ? tiposEnsino : 
                categoria === "Pesquisa" ? tiposPesquisa : [];

    tipos.forEach(t => {
        let option = document.createElement("option");
        option.value = t;
        option.textContent = t;
        tipo.appendChild(option);
    });
}

function adicionarAtividade() {
    let descricao = document.getElementById("descricao").value;
    let categoria = document.getElementById("categoria").value;
    let tipo = document.getElementById("tipo").value;
    let horas = parseFloat(document.getElementById("horas").value);

    if (isNaN(horas) || horas <= 0) {
        alert("Por favor, insira um valor válido para as horas.");
        return;
    }

    if (limitesPorAtividade[tipo]) {
        let horasAproveitadas = horas * limitesPorAtividade[tipo].aproveitamento;
        let horasDisponiveisAtividade = limitesPorAtividade[tipo].limite - (horasPorAtividade[tipo] || 0);

        if (limitesPorAtividade[tipo].porPublicacao) {
            horasAproveitadas = Math.min(horasAproveitadas, limitesPorAtividade[tipo].limite);
        } else {
            if (horasAproveitadas > horasDisponiveisAtividade) {
                horasAproveitadas = horasDisponiveisAtividade;
            }
        }

        let horasDisponiveisCategoria = 90 - horasPorCategoria[categoria];
        if (horasAproveitadas > horasDisponiveisCategoria) {
            horasAproveitadas = horasDisponiveisCategoria;
        }

        if (horasAproveitadas <= 0) {
            alert("Limite de horas para esta atividade ou categoria já foi atingido.");
            return;
        }

        if (!horasPorAtividade[tipo]) {
            horasPorAtividade[tipo] = 0;
        }
        horasPorAtividade[tipo] += horasAproveitadas;
        horasPorCategoria[categoria] += horasAproveitadas;

        // Adiciona a atividade à lista
        atividades.push({ descricao, categoria, tipo, horas: horasAproveitadas });

        // Salva a atividade no Firestore
        db.collection("atividades").add({
            descricao: descricao,
            categoria: categoria,
            tipo: tipo,
            horas: horasAproveitadas,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log("Atividade salva com sucesso!");
            atualizarLista();
            limparFormulario();
        })
        .catch((error) => {
            console.error("Erro ao salvar atividade: ", error);
        });
    } else {
        alert("Tipo de atividade não encontrado.");
    }
}

function atualizarLista() {
    let lista = document.getElementById("listaAtividades");
    lista.innerHTML = "";
    atividades.forEach((atv, index) => {
        lista.innerHTML += `<li>${atv.descricao} - ${atv.categoria} - ${atv.tipo} - ${atv.horas.toFixed(1)}h</li>`;
    });

    // Atualiza as horas por categoria
    document.getElementById("horasEnsino").textContent = horasPorCategoria["Ensino"].toFixed(1);
    document.getElementById("horasExtensao").textContent = horasPorCategoria["Extensao"].toFixed(1);
    document.getElementById("horasPesquisa").textContent = horasPorCategoria["Pesquisa"].toFixed(1);

    // Calcula e exibe o total geral de horas
    let totalGeral = horasPorCategoria["Ensino"] + horasPorCategoria["Extensao"] + horasPorCategoria["Pesquisa"];
    document.getElementById("totalGeral").textContent = totalGeral.toFixed(1);

    // Verifica se o total geral atingiu o mínimo de 150 horas
    if (totalGeral >= 150) {
        alert("Parabéns! Você atingiu o mínimo de 150 horas.");
    }
}

function limparFormulario() {
    document.getElementById("descricao").value = "";
    document.getElementById("horas").value = "";
    document.getElementById("categoria").selectedIndex = 0;
    atualizarTipos();
}

function limparRegistros() {
    atividades = [];
    horasPorCategoria = { Ensino: 0, Extensao: 0, Pesquisa: 0 };
    horasPorAtividade = {};
    atualizarLista();
    limparFormulario();
    alert("Todos os registros foram limpos.");
}

function carregarAtividades() {
    db.collection("atividades").orderBy("timestamp", "desc").get()
        .then((querySnapshot) => {
            atividades = [];
            horasPorCategoria = { Ensino: 0, Extensao: 0, Pesquisa: 0 };
            horasPorAtividade = {};

            querySnapshot.forEach((doc) => {
                let data = doc.data();
                atividades.push(data);
                horasPorCategoria[data.categoria] += data.horas;
                horasPorAtividade[data.tipo] = (horasPorAtividade[data.tipo] || 0) + data.horas;
            });

            atualizarLista();
        })
        .catch((error) => {
            console.error("Erro ao carregar atividades: ", error);
        });
}

// Carrega as atividades quando a página é carregada
window.onload = carregarAtividades;