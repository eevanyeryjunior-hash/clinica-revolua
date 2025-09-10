// Mostrar descrição das consultas
const consultasLi = document.querySelectorAll('.consultas li');
const descDiv = document.getElementById('desc-consulta');
consultasLi.forEach(li=>{
  li.addEventListener('mouseenter',()=>descDiv.textContent=li.dataset.desc);
  li.addEventListener('mouseleave',()=>descDiv.textContent='');
});

// Calendário e horários
const hoje = new Date();
const diasSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const horarios = [];
for(let h=8;h<=19;h++) horarios.push(h.toString().padStart(2,'0')+":00");

let agendamentos = {};
const calendario = document.getElementById('calendario');
const horariosDiv = document.getElementById('horarios');
let dataSelecionada=null;
let horaSelecionada=null;

function gerarCalendario(){
  calendario.innerHTML='';
  for(let i=0;i<30;i++){
    const dia = new Date();
    dia.setDate(hoje.getDate()+i);
    const diaStr = dia.toISOString().split('T')[0];
    const div = document.createElement('div');
    div.classList.add('dia');
    div.dataset.date=diaStr;
    div.textContent=dia.getDate();
    div.title=diasSemana[dia.getDay()];
    div.addEventListener('click',()=>selecionarDia(div));
    calendario.appendChild(div);
  }
}
gerarCalendario();

function selecionarDia(div){
  if(div.classList.contains('inativo')) return;
  document.querySelectorAll('.dia').forEach(d=>d.classList.remove('selecionado'));
  div.classList.add('selecionado');
  dataSelecionada=div.dataset.date;
  gerarHorarios(dataSelecionada);
}

function gerarHorarios(data){
  horariosDiv.innerHTML='';
  horarios.forEach(h=>{
    const btn=document.createElement('div');
    btn.textContent=h;
    btn.classList.add('hora');
    if(agendamentos[data] && agendamentos[data].includes(h)){
      btn.classList.add('ocupada');
    } else {
      btn.addEventListener('click',()=>selecionarHora(btn));
    }
    horariosDiv.appendChild(btn);
  });
}

function selecionarHora(btn){
  horaSelecionada=btn.textContent;
  document.querySelectorAll('.hora').forEach(h=>h.classList.remove('selecionado'));
  btn.classList.add('selecionado');
}

// Formulário
const form=document.getElementById('form-agendamento');
const msg=document.getElementById('msg');

form.addEventListener('submit',e=>{
  e.preventDefault();
  const nome=document.getElementById('nome').value.trim();
  const email=document.getElementById('email').value.trim();
  const consulta=document.getElementById('consulta').value;

  if(!nome||!email||!consulta||!dataSelecionada||!horaSelecionada){
    msg.textContent="Preencha todos os campos, dia e horário!";
    msg.style.color='red';
    return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    msg.textContent="Insira um e-mail válido!";
    msg.style.color='red';
    return;
  }

  if(!agendamentos[dataSelecionada]) agendamentos[dataSelecionada]=[];
  agendamentos[dataSelecionada].push(horaSelecionada);
  gerarHorarios(dataSelecionada);

  const numero="5584921474232";
  const texto=`Agendamento:%0ANome: ${nome}%0AEmail: ${email}%0AConsulta: ${consulta}%0AData: ${dataSelecionada}%0AHora: ${horaSelecionada}`;
  window.open(`https://wa.me/${numero}?text=${texto}`,'_blank');

  msg.textContent="Agendamento enviado via WhatsApp!";
  msg.style.color="#1DB954";
  form.reset();
  dataSelecionada=null;
  horaSelecionada=null;
});
