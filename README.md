Bibliotecas:

npm i class-validator class-transformer
https://github.com/typestack/class-validator#validation-decorators


npm i @nestjs/mapped-types
https://docs.nestjs.com/openapi/mapped-types


Conexão com o banco de dados:

PRISMA
1- instalar o prisma
npm i -D prisma

2- Iniciar e seguir tutorial ( montar conexão no arquivo .env e configurar no schema.prisma ).
npx prisma init

3- Após banco e tabela criados manualmente. Faça pull para atualizar o schema.prisma.
npx prisma db pull

4- Depois que o banco e o schema.prisma derem match com o comando acima, use generate.
npx prisma generate

OBS: O prisma usa o arquivo schema.prisma para unir com o banco de dados de uma forma especial. Desta forma, 
evitando a criação de uma classe modelo e uma classe de conexão com o banco de dados como por exemplo spring data jpa.
É um arquivo que serve como modelo de entidade e classe de conexão com o banco.