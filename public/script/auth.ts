const AUTH_API_URL = '/auth';
const TOKEN_KEY = 'authToken';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export function obterToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao obter token do localStorage:', error);
    return null;
  }
}

export function salvarToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Erro ao salvar token no localStorage:', error);
    throw new Error('Não foi possível salvar a sessão. Verifique as configurações do navegador.');
  }
}

export function removerToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao remover token do localStorage:', error);
  }
}

export function estaAutenticado(): boolean {
  return obterToken() !== null;
}

export function obterHeadersAutenticacao(): HeadersInit {
  const token = obterToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

function validarCredenciais(email: string, password: string): ValidationError[] {
  const erros: ValidationError[] = [];

  if (!email || !email.trim()) {
    erros.push({ field: 'email', message: 'Email é obrigatório' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    erros.push({ field: 'email', message: 'Email inválido' });
  }

  if (!password || !password.trim()) {
    erros.push({ field: 'password', message: 'Senha é obrigatória' });
  } else if (password.length < 6) {
    erros.push({ field: 'password', message: 'Senha deve ter no mínimo 6 caracteres' });
  }

  return erros;
}

export async function fazerLogin(email: string, password: string): Promise<LoginResponse> {
  const errosValidacao = validarCredenciais(email, password);
  if (errosValidacao.length > 0) {
    throw new Error(errosValidacao[0].message);
  }

  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email.trim(), password })
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao fazer login');
    } catch {
      throw new Error('Erro ao conectar com o servidor');
    }
  }

  const data: LoginResponse = await response.json();
  salvarToken(data.token);
  return data;
}

export function fazerLogout(): void {
  removerToken();
  window.location.reload();
}

export function abrirModalLogin(): void {
  const modal = document.getElementById('modal-login') as HTMLDivElement | null;
  if (modal) {
    modal.classList.add('open');
  }
}

export function fecharModalLogin(): void {
  const modal = document.getElementById('modal-login') as HTMLDivElement | null;
  if (modal) {
    modal.classList.remove('open');
  }
}

export function atualizarUIAutenticacao(): void {
  const loginBtn = document.querySelector('.btn-login') as HTMLButtonElement | null;
  const registerBtn = document.querySelector('.btn-register') as HTMLButtonElement | null;
  const autenticado = estaAutenticado();

  if (!loginBtn || !registerBtn) {
    console.warn('Botões de autenticação não encontrados');
    return;
  }

  if (autenticado) {
    loginBtn.textContent = 'Logout';
    registerBtn.style.display = 'none';
  } else {
    loginBtn.textContent = 'Login';
    registerBtn.style.display = 'inline-block';
  }
}

export function atualizarBotoesFavoritos(): void {
  const botoesFavorito = document.querySelectorAll('.btn-favoritar');
  const autenticado = estaAutenticado();

  botoesFavorito.forEach(btn => {
    const btnElement = btn as HTMLElement;
    if (autenticado) {
      btnElement.style.cursor = 'pointer';
      btnElement.style.opacity = '1';
      btnElement.setAttribute('aria-disabled', 'false');
    } else {
      btnElement.style.cursor = 'not-allowed';
      btnElement.style.opacity = '0.5';
      btnElement.setAttribute('aria-disabled', 'true');
    }
  });
}

function obterElementoLogin(): {
  modal: HTMLDivElement | null;
  formulario: HTMLFormElement | null;
  btnFechar: HTMLElement | null;
  loginBtn: HTMLButtonElement | null;
  registerBtn: HTMLButtonElement | null;
  emailInput: HTMLInputElement | null;
  passwordInput: HTMLInputElement | null;
  msgErro: HTMLElement | null;
} {
  return {
    modal: document.getElementById('modal-login') as HTMLDivElement | null,
    formulario: document.getElementById('formulario-login') as HTMLFormElement | null,
    btnFechar: document.querySelector('.modal-close') as HTMLElement | null,
    loginBtn: document.querySelector('.btn-login') as HTMLButtonElement | null,
    registerBtn: document.querySelector('.btn-register') as HTMLButtonElement | null,
    emailInput: document.getElementById('email') as HTMLInputElement | null,
    passwordInput: document.getElementById('password') as HTMLInputElement | null,
    msgErro: document.getElementById('login-error') as HTMLElement | null
  };
}

export function inicializarAutenticacao(): void {
  const elementos = obterElementoLogin();

  if (!elementos.modal || !elementos.formulario || !elementos.loginBtn) {
    console.error('Elementos de autenticação não encontrados no DOM');
    return;
  }

  elementos.loginBtn.addEventListener('click', (e: Event) => {
    e.preventDefault();
    if (estaAutenticado()) {
      fazerLogout();
    } else {
      abrirModalLogin();
    }
  });
  
  elementos.btnFechar?.addEventListener('click', fecharModalLogin);

  elementos.registerBtn?.addEventListener('click', (e: Event) => {
    e.preventDefault();
    alert('Funcionalidade de registro ainda não disponível');
  });

  elementos.modal.addEventListener('click', (e: MouseEvent) => {
    if (e.target === elementos.modal) {
      fecharModalLogin();
    }
  });

  if (elementos.formulario) {
    elementos.formulario.addEventListener('submit', async (e: Event) => {
      e.preventDefault();

      if (!elementos.emailInput || !elementos.passwordInput || !elementos.msgErro) {
        console.error('Campos de formulário não encontrados');
        return;
      }

      try {
        elementos.msgErro.textContent = '';
        await fazerLogin(elementos.emailInput.value, elementos.passwordInput.value);
        fecharModalLogin();
        elementos.formulario!.reset();
        atualizarUIAutenticacao();
        atualizarBotoesFavoritos();
      } catch (error: any) {
        elementos.msgErro.textContent = error.message || 'Erro ao fazer login';
        elementos.msgErro.setAttribute('role', 'alert');
      }
    });
  }

  atualizarUIAutenticacao();
}
