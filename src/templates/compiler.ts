import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';

const __dirname = dirname(fileURLToPath(import.meta.url));

let recoverPasswordTemplate: Handlebars.TemplateDelegate | null = null;
let contactReceivedTemplate: Handlebars.TemplateDelegate | null = null;

function getRecoverPasswordTemplate(): Handlebars.TemplateDelegate {
  if (!recoverPasswordTemplate) {
    const path = join(__dirname, 'recover-password.hbs');
    const source = readFileSync(path, 'utf-8');
    recoverPasswordTemplate = Handlebars.compile(source);
  }
  return recoverPasswordTemplate;
}

function getContactReceivedTemplate(): Handlebars.TemplateDelegate {
  if (!contactReceivedTemplate) {
    const path = join(__dirname, 'contact-received.hbs');
    const source = readFileSync(path, 'utf-8');
    contactReceivedTemplate = Handlebars.compile(source);
  }
  return contactReceivedTemplate;
}

export interface RecoverPasswordData {
  resetLink: string;
  userName?: string;
  expiryMinutes?: number;
}

export interface ContactReceivedData {
  subject: string;
  email: string;
  phone?: string;
  message: string;
}

/**
 * Renderiza o template de recuperação de senha.
 * @param data - { resetLink, userName?, expiryMinutes? }
 */
export function renderRecoverPassword(data: RecoverPasswordData): string {
  return getRecoverPasswordTemplate()(data);
}

/**
 * Renderiza o template de contato recebido.
 * @param data - { name, email, phone?, message }
 */
export function renderContactReceived(data: ContactReceivedData): string {
  return getContactReceivedTemplate()(data);
}
