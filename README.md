# Explora Mundo — Consulta de Países

Trabalho de Fundamentos ao Desenvolvimento Web.

## Como executar
Abra `index.html` no navegador ou use a extensão Live Server do VS Code. A consulta exige internet.

## Tecnologias
HTML, CSS, Bootstrap 5.3 para o layout e JavaScript puro com fetch.
Visual adaptado dos exemplos ViaCEP fornecidos.

## Consultas da API
- `GET https://countries.dev/countries?fields=name,capital,region,population,flags,alpha3Code` — lista completa, sem filtros.
- `GET https://countries.dev/name/{nome}` — pesquisa por nome.
- `GET https://countries.dev/region/{regiao}` — filtro por região.
- `GET https://countries.dev/alpha/{codigo}` — detalhes de um único país.

O JavaScript de integração foi mantido da versão anterior, que já foi testada pelo aluno.
