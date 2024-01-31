proxyAlias = {
  d: 'DIRECT',
  g: '🌐 国外流量',
  s: '🎬 国际流媒体',
  o: '🚥 其他流量',
  rej: 'REJECT',
};
sc_domains = ['shinycolors.enza.fun'];
spotify_stream_domains_kw = ['spotify-com.akamaized.net', 'audio-fa.scdn.co'];
youtube_stream_domains = ['googlevideo.com'];
googledrive_content_domains_kw = ['docs.googleusercontent.com'];
nico_stream_domains = ['dmc.nico','delivery.domand.nicovideo.jp','asset.domand.nicovideo.jp'];
not_stream_domains = ['dmm.com', 'www.amazon.com'];
jp_only_domains = ['dmm.co.jp']; //更新中
block_china_domains = ['ddnavi.com', 'wsapi.master.live', 'api.nimo.tv']; //更新中
banned_domains = [
  'spankbang.com',
  'www.dcode.fr',
  'gstatic.com',
  'gateway.discord.gg',
  'translate.googleapis.com',
  'nyaa.si',
  'yande.re',
  'vercel.app',
  'bangumi.moe',
  'socialblade.com',
  'kemono.party',
  'kemono.su',
  'wrtn.ai',
];
direct_domains = ['jpopsuki.eu', 'daydream.dmhy.best', 'tracker.hdarea.club'];
block_domains = ['update.scdn.co'];
other_domains = ['pythontutor.com', 'jp1.mikeslab.dix.asia']; //更新中
other_stream_domains = ['mxdcontent.net', 'mixdrop.bz']; //更新中
openai_domains = ['openai.com', 'sentry.io', 'oaistatic.com', 'oaiusercontent.com'];
test_domains = ['zh.moegirl.org.cn'];

module.exports.parse = ({ content, name, url }, { yaml, axios, notify }) => {
  const addRules = (domains, proxy = '🌐 国外流量', type = 'DOMAIN-SUFFIX') => {
    domains.map((domain) => content.rules.unshift(`${type.toUpperCase()},${domain},${proxy}`));
  };
  proxiesNameFilter = (...kws) => {
    return content.proxies
      .filter((proxy) => kws.every((kw) => proxy.name.includes(kw)))
      .map((p) => p.name);
  };
  // content['proxy-groups'].splice(9, 0, {
  //   'name': '.1 balance',
  //   'type': 'load-balance',
  //   'proxies': ["", ""],
  //   'url': 'http://cp.cloudflare.com/generate_204',
  //   'interval': 3
  // });
  content['proxy-groups'].splice(2, 0, {
    name: '.1',
    type: 'select',
    proxies: ['🌐 国外流量', ...proxiesNameFilter('0.1')],
  });
  content['proxy-groups'].splice(3, 0, {
    name: 'ニコニコ',
    type: 'select',
    proxies: ['🌐 国外流量', '🎬 国际流媒体', ...proxiesNameFilter('🇯🇵'), '➡️ 直接连接'],
  });
  content['proxy-groups'].splice(6, 0, {
    name: 'AbemaTV',
    type: 'select',
    proxies: ['🌐 国外流量', '🎬 国际流媒体', ...proxiesNameFilter('🇯🇵'), '➡️ 直接连接'],
  });
  content['proxy-groups'].splice(7, 0, {
    name: 'Bahamut',
    type: 'select',
    proxies: ['🌐 国外流量', '🎬 国际流媒体', ...proxiesNameFilter('🇹🇼'), '➡️ 直接连接'],
  });
  content['proxy-groups'].splice(4, 0, {
    name: 'YouTube',
    type: 'select',
    proxies: ['🌐 国外流量', '🎬 国际流媒体', ...proxiesNameFilter(''), '➡️ 直接连接'],
  });
  content['proxy-groups'].splice(10, 0, {
    name: 'Telegram',
    type: 'select',
    proxies: ['🌐 国外流量', ...proxiesNameFilter(''), '➡️ 直接连接'],
  });
  content['proxy-groups'].splice(11, 0, {
    name: 'jp_other',
    type: 'select',
    proxies: ['🌐 国外流量', ...proxiesNameFilter('🇯🇵'), '➡️ 直接连接'],
  });
  content['proxy-groups'].splice(5, 0, {
    name: 'ChatGPT',
    type: 'select',
    proxies: ['🌐 国外流量', '🇯🇵 日本 11 IIJ IPv6'],
  });
  // content['proxy-groups'].splice(3, 0, {
  //   'name': 'test（记得关 pac ！）',
  //   'type': 'select',
  //   'proxies': ['➡️ 直接连接', '🌐 国外流量', '🎬 国际流媒体', ...proxiesNameFilter("")]
  // });
  content.rules.unshift('RULE-SET,nico,ニコニコ');
  content.rules.unshift('RULE-SET,AbemaTV,AbemaTV');
  content.rules.unshift('RULE-SET,Bahamut,Bahamut');
  content.rules.unshift('RULE-SET,Spotify,🌐 国外流量');
  content.rules.unshift('RULE-SET,YouTube,YouTube');
  content.rules.unshift('RULE-SET,TelegramSG,Telegram'); //不准确？
  ////组间路由
  content['proxy-groups'].find((p) => p.name == '🚥 其他流量').proxies.splice(2, 0, '.1');
  content['proxy-groups'].find((p) => p.name == '🌐 国外流量').proxies.splice(2, 0);
  content['proxy-groups']
    .find((p) => p.name == '🎬 大陆流媒体国际版')
    .proxies.push(...proxiesNameFilter('新加坡'));
  //content['proxy-groups'].find(p => p.name == ".1").proxies.splice(2, 0, ".1 balance");
  ////streams start
  addRules(nico_stream_domains, '.1');
  addRules(youtube_stream_domains, '.1');
  addRules(spotify_stream_domains_kw, proxyAlias['o'], 'domain-keyword');
  addRules(other_stream_domains, '.1');
  ////streams end
  //addRules(sc_domains);   //山药色彩
  addRules(jp_only_domains, 'jp_other');
  addRules(googledrive_content_domains_kw, '.1', 'domain-keyword');
  addRules(block_china_domains);
  addRules(banned_domains);
  addRules(openai_domains, 'ChatGPT');
  addRules(not_stream_domains, '🚥 其他流量');
  addRules(['sharepoint.com'], proxyAlias['d']);
  addRules(direct_domains, proxyAlias['d']);
  addRules(block_domains, proxyAlias.rej);
  addRules(other_domains);
  // addRules(test_domains, "test（记得关 pac ！）");
  return content;
};
