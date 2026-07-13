// backend/utils/validators.js
import validator from 'validator';
import dns from 'dns';

/**
 * Password rule: at least 8 characters, containing at least
 * one letter, one number, and one special character.
 * (This is checked on both frontend and backend — frontend is
 * just for UX, backend is the real gate.)
 */
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export function isPasswordStrong(password) {
  if (typeof password !== 'string') return false;
  return PASSWORD_REGEX.test(password);
}

export function passwordRequirementsMessage() {
  return 'Password must be at least 8 characters long and include a letter, a number, and a special character (e.g. !@#$%).';
}

/**
 * Checks that an email is well-formed AND that its domain actually
 * has mail servers configured (MX records). This catches typos and
 * made-up domains (e.g. "test@fakemail123.com") without needing a
 * paid email-verification API.
 *
 * NOTE: This confirms the domain can receive mail — it cannot
 * confirm the specific mailbox exists (that requires either a paid
 * verification API like ZeroBounce/AbstractAPI, or an SMTP handshake,
 * which most mail servers block/throttle for anti-spam reasons).
 * The strongest real-world guarantee is still: send a verification
 * link and require the user to click it (which this app already does
 * via authroutes.js — the missing piece was actually sending the email,
 * which mailer.js now handles).
 */
export async function isEmailDeliverable(email) {
  if (!validator.isEmail(email)) {
    return { valid: false, reason: 'Email address is not in a valid format.' };
  }

  const domain = email.split('@')[1];

  try {
    const mxRecords = await dns.promises.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, reason: 'This email domain cannot receive mail (no mail servers found).' };
    }
    return { valid: true };
  } catch (err) {
    // ENOTFOUND / ENODATA means the domain doesn't exist or has no mail setup
    return { valid: false, reason: 'This email domain does not exist or cannot receive mail.' };
  }
}
