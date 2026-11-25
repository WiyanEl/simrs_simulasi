<?php

return [
  'GET api/user' => 'api/user/index',
  'GET api/user/<id:\d+>' => 'api/user/view',
  'POST api/user' => 'api/user/create',
  'PUT api/user/<id:\d+>' => 'api/user/update',
  'DELETE api/user/<id:\d+>' => 'api/user/delete',
];