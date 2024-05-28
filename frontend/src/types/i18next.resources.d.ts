interface Resources {
  admin: {
    dashboard: {
      title: 'Dashboard';
      navbar: {
        title: 'Navbar Title';
      };
      sidebar: {
        title: 'Sidebar Title';
      };
    };
  };
  common: {
    title: 'LunarEclipse';
    'back-to-home': 'Zurück zur Hauptseite';
    counter_one: 'eines ausgewählt';
    counter_other: '{{count}} ausgewählt';
    counter_zero: 'keines ausgewählt';
    h1: 'Eine client Seite, um das client-seitige i18n zu demonstrieren';
    'to-second-client-page': 'zur zweiten client Seite';
    navigation: {
      home: 'Home';
      review: 'Reviews';
      team: 'Team';
    };
    login: {
      title: 'Login';
    };
  };
  dev: {
    home: {
      title: 'DEV-Area';
    };
  };
  main: {
    index: {
      'hero-section': {
        'title-1': 'Explore the magic world of Meridianis';
        'subtitle-1': 'Wander alone or together with other players the landscape, cross plains, crest mountains or explore dark forests.';
      };
    };
  };
  translation: {
    h1: 'A simple example';
    title: 'Home';
    'to-client-page': 'To client page';
    'to-second-page': 'To second page';
    welcome: 'Welcome to Next.js 13/14 <1>with the new app directory features</1> and i18next';
  };
}

export default Resources;
