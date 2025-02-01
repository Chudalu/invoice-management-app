export class EncryptionService {

    static encrypt(textToEncrypt: string | any, key: string): string {
        let textToChars = (text: any) => text.split('').map((c: any) => c.charCodeAt(0));
        let byteHex = (n: any) => ('0' + Number(n).toString(16)).substr(-2);
        let applySaltToChar = (code: any) => textToChars(key).reduce((a: any, b: any) => a ^ b, code);
        return textToEncrypt.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('');
    }

    static decrypt(textToDecrypt: string | any, key: string): string {
        let textToChars = (text: any) => text.split('').map((c: any) => c.charCodeAt(0));
        let applySaltToChar = (code: any) => textToChars(key).reduce((a: any, b: any) => a ^ b, code);
        return textToDecrypt.match(/.{1,2}/g).map((hex: any) => parseInt(hex, 16)).map(applySaltToChar)
            .map((charCode: any) => String.fromCharCode(charCode))
            .join('');
    }
}
