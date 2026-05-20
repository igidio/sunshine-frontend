const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

const target_path = process.argv[2] || './src/environments/environment.ts';
const target_path_dev = './src/environments/environment.development.ts';

const server_url = process.env['SERVER_URL'] || 'http://localhost:3000';
const image_prefix = process.env['IMAGE_PREFIX'] || 'http://localhost:3000/uploads/';

if ( !server_url) {
  throw new Error('SERVER_URL environment variable is not set');
}

const env_file_content = `
export const environment = {
  serverUrl: '${server_url}',
  imagePrefix: '${image_prefix}',
};
`
mkdirSync('./src/environments', { recursive: true });

writeFileSync(target_path, env_file_content);
writeFileSync(target_path_dev, env_file_content);
