import App from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { ErrorRoute } from '@routes/error.route';
import { NamespaceRoute } from './routes/namespace.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([
  new AuthRoute(),
  new UserRoute(),
  new ErrorRoute(),
  new NamespaceRoute(),
]);

app.listen();
