import { connect } from 'react-redux';

import { newClientClick } from 'src/public/actions';
import { downloadClientChange } from 'src/common/components/DownloadClientDropdown/lib/handlers';

import View from './View';

const logSettings = { page: 'Product', source: 'MainScreen' };

export default connect(undefined, {
  onOnlineClientClick: () => newClientClick(logSettings),
  onDownloadChange: downloadClientChange(logSettings),
})(View);
