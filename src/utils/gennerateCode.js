export function generateCode(length = 8) {
    const rune = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * rune.length);
        code += rune[randomIndex];
    }
    return code;
}
