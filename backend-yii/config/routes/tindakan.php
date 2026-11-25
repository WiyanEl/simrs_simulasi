<?php

return [
  'GET api/tindakan' => 'api/tindakan/index',
  'GET api/tindakan/<id:\d+>' => 'api/tindakan/view',
  'POST api/tindakan' => 'api/tindakan/create',
  'PUT api/tindakan/<id:\d+>' => 'api/tindakan/update',
  'DELETE api/tindakan/<id:\d+>' => 'api/tindakan/delete',
];