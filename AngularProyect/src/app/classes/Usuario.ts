export class Usuario{
    id:string|undefined;
    email:string | undefined;
    nombre:string | undefined;
    fechaNacimiento:Date | undefined;
    genero:string | undefined;
    pais:string | undefined;
    password:string | undefined;
    tipo:string | undefined;

    public convertToUUID(numberGoogle:string):string{
        return numberGoogle.substr(0, 8) + '-' + numberGoogle.substr(8, 4) + '-' + numberGoogle.substr(12, 4) + '-' + numberGoogle.substr(16, 4) + '-' + numberGoogle.substr(20, 1) + '00000000000';
    }
}
