// register ptt robot into site manager
define([
  'sites/ptt/robot',
  'core/utils/siteManager'], function (RobotPtt, siteManager) {

siteManager.regSite('PTT',
  {
    name: 'PTT',
    addr: 'ptt.cc',
    port: 23, //set 22 for ssh
    protocol: 'websocket', //set 'ssh' for ssh, 'websocket' for websocket
    prefsRoot: 'openptt.',
    col: 80,
    row: 24,
    charset: 'big5',
    enterChar: '^M',
    Robot: RobotPtt
  }
);

});
