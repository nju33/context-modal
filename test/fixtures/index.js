(() => {
  const els = document.querySelectorAll('[data-context-modal-for]');
  const ctxModal = new ContextModal(els);
  // let count = 0;
  ctxModal.init();

  set('like-context-menu');
  set('like-dropdown');

  function set(id) {
    const el = document.getElementById(id);
    el.addEventListener('contextmodalwillshow', ev => {
      console.log(
        `%c${id}\n  %con:%c${ev.type}`,
        'color: #cb1b45',
        'color: #888;',
        'color: #1bafcb'
      );
    });
    el.addEventListener('contextmodaldidshow', ev => {
      console.log(
        `%c${id}\n  %con:%c${ev.type}`,
        'color: #cb1b45',
        'color: #888;',
        'color: #1bafcb'
      );
    });
    el.addEventListener('contextmodalwillhide', ev => {
      console.log(
        `%c${id}\n  %con:%c${ev.type}`,
        'color: #cb1b45',
        'color: #888;',
        'color: #1bafcb'
      );
    });
    el.addEventListener('contextmodaldidhide', ev => {
      console.log(
        `%c${id}\n  %con:%c${ev.type}`,
        'color: #cb1b45',
        'color: #888;',
        'color: #1bafcb'
      );
      // count++;
      // if (count > 3) {
      //   ctxModal.teardown();
      // }
    });
  }
})();
