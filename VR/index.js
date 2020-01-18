import { AppRegistry } from 'react-360';
import TopPosts from './TopPosts';
import CurrentPost from './CurrentPost';
import ModelView from './ModelView';
import * as Store from './Store';
Store.initialize('AIzaSyDcYsrWglFyuKtlNAgj0JqkUP-dbubN2qc');

AppRegistry.registerComponent('ModelView', () => ModelView);
