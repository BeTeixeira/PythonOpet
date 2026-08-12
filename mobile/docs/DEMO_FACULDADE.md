# Demo na faculdade — checklist

O app usa dados mockados (sem backend real). Nada roda no computador da faculdade —
só o seu celular precisa do Expo Go (ou do APK já instalado).

## Antes de ir (no seu notebook, com internet e sem restrições)

1. Login na Expo (uma vez só, abre o navegador):
   ```bash
   cd PythonOpet/mobile
   npx eas-cli login
   ```
2. Vincular o projeto à sua conta (preenche `projectId` em `app.json` automaticamente):
   ```bash
   npx eas-cli init
   ```
3. Publicar a versão atual via EAS Update (plano A — usa internet no celular na hora):
   ```bash
   npx eas-cli update --branch presentation --message "Demo faculdade"
   ```
   Isso imprime um link/QR. Salve o link — é permanente até você publicar de novo.
4. Gerar o APK standalone (plano B — funciona sem internet na hora da demo):
   ```bash
   npx eas-cli build --platform android --profile preview
   ```
   Aguarde o build na nuvem (alguns minutos) e baixe o `.apk` pelo link impresso ao final,
   ou pelo painel em https://expo.dev — instale no celular Android (ative "instalar de
   fontes desconhecidas" se pedido).

## Na faculdade

- **Plano A:** abra o Expo Go no celular → "Enter URL manually" → cole o link do passo 3
  (ou escaneie o QR salvo). Precisa só de internet no celular (wifi da faculdade ou dados
  móveis) — nenhuma etapa depende do computador da faculdade.
- **Plano B:** abra o app já instalado via APK — funciona sem internet.
