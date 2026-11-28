// Drag to reorder: <ul data-sortable="chapters"> with <li data-id> rows containing a .handle.
// Works with mouse and touch (pointer events). Saves the new order to /api/admin/reorder.
export function initSortable() {
  document.querySelectorAll<HTMLElement>('[data-sortable]').forEach((list) => {
    let dragging: HTMLElement | null = null;
    let justDragged = false;

    // A drag that starts on a handle inside <summary> must not also open/close it.
    list.addEventListener(
      'click',
      (e) => {
        if (justDragged || (e.target as HTMLElement).closest('.handle')) {
          e.preventDefault();
          e.stopPropagation();
          justDragged = false;
        }
      },
      true,
    );

    list.addEventListener('pointerdown', (e) => {
      const handle = (e.target as HTMLElement).closest('.handle');
      if (!handle) return;
      dragging = handle.closest('[data-id]');
      if (!dragging) return;
      e.preventDefault();
      dragging.classList.add('dragging');
      (handle as HTMLElement).setPointerCapture(e.pointerId);
    });

    list.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const rows = [...list.querySelectorAll<HTMLElement>('[data-id]')].filter((r) => r !== dragging);
      const after = rows.find((r) => {
        const box = r.getBoundingClientRect();
        return e.clientY < box.top + box.height / 2;
      });
      if (after) list.insertBefore(dragging, after);
      else list.appendChild(dragging);
    });

    const drop = async () => {
      if (!dragging) return;
      dragging.classList.remove('dragging');
      dragging = null;
      justDragged = true;
      setTimeout(() => (justDragged = false), 0);
      const ids = [...list.querySelectorAll<HTMLElement>('[data-id]')].map((r) => Number(r.dataset.id));
      list.querySelectorAll<HTMLElement>('[data-num]').forEach((n, i) => (n.textContent = String(i + 1).padStart(2, '0')));
      await fetch('/api/admin/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: list.dataset.sortable, ids }),
      });
    };
    list.addEventListener('pointerup', drop);
    list.addEventListener('pointercancel', drop);
  });
}
