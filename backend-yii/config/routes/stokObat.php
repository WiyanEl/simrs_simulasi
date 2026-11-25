<?php

return [
  'GET api/stok-obat' => 'api/stok-obat/index',
  'GET api/stok-obat/<id:\d+>' => 'api/stok-obat/view',
  'PUT api/stok-obat/<id:\d+>' => 'api/stok-obat/update',
];