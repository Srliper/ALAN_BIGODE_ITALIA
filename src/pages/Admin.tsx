import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ArrowDown, ArrowUp, Crown, ImagePlus, LogOut, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { business, formatPrice } from '@/config';
import { formatDuration } from '@/data/services';
import { deletePhoto, uploadPhoto } from '@/lib/images';
import { getSupabase, isSupabaseConfigured, type CutTypeRow, type GalleryRow, type ServiceRow } from '@/lib/supabase';

type Tab = 'services' | 'cuts' | 'gallery';

// Executa uma ação do painel mostrando erro ou sucesso num aviso
const run = async (action: () => Promise<unknown>, success?: string) => {
  try {
    await action();
    if (success) toast({ title: success });
    return true;
  } catch (err) {
    toast({
      title: 'Algo deu errado',
      description: err instanceof Error ? err.message : String(err),
      variant: 'destructive',
    });
    return false;
  }
};

// O Supabase devolve { error } em vez de lançar exceção
const check = <T extends { error: unknown }>(result: T) => {
  if (result.error) throw result.error;
  return result;
};

const swapSort = async (
  table: string,
  a: { id: string | number; sort: number },
  b: { id: string | number; sort: number },
) => {
  const supabase = await getSupabase();
  // Se as posições forem iguais (linhas novas), usa a posição na lista para desempatar
  const [sortA, sortB] = a.sort === b.sort ? [b.sort + 1, a.sort] : [b.sort, a.sort];
  check(await supabase.from(table).update({ sort: sortA }).eq('id', a.id));
  check(await supabase.from(table).update({ sort: sortB }).eq('id', b.id));
};

const nextSort = (rows: { sort: number }[]) => (rows.length ? Math.max(...rows.map((r) => r.sort)) + 1 : 0);

const Shell = ({ children, onSignOut }: { children: ReactNode; onSignOut?: () => void }) => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-primary" />
          <span className="font-display text-lg font-bold text-gradient-gold">{business.name}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">admin</span>
        </a>
        {onSignOut && (
          <Button variant="ghost" size="sm" onClick={onSignOut} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        )}
      </div>
    </header>
    <main className="container mx-auto px-4 py-8 max-w-4xl">{children}</main>
  </div>
);

const NotConfigured = () => (
  <div className="bg-card border border-border rounded-xl p-6 space-y-3 text-muted-foreground">
    <h1 className="text-2xl font-bold text-foreground">Painel ainda não configurado</h1>
    <p>
      Para ativar o painel, crie um projeto gratuito no Supabase e adicione as variáveis{' '}
      <code className="text-primary">VITE_SUPABASE_URL</code> e{' '}
      <code className="text-primary">VITE_SUPABASE_ANON_KEY</code> na Vercel. O passo a passo está no arquivo{' '}
      <code className="text-primary">ADMIN.md</code> do projeto.
    </p>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await run(async () => {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error('E-mail ou senha incorretos.');
    });
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto bg-card border border-border rounded-xl p-6 space-y-4 mt-10"
    >
      <h1 className="text-2xl font-bold text-foreground">Entrar no painel</h1>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  );
};

const MoveButtons = ({
  onUp,
  onDown,
  first,
  last,
}: {
  onUp: () => void;
  onDown: () => void;
  first: boolean;
  last: boolean;
}) => (
  <div className="flex gap-1">
    <Button type="button" variant="outline" size="sm" onClick={onUp} disabled={first} aria-label="Mover para cima">
      <ArrowUp className="w-4 h-4" />
    </Button>
    <Button type="button" variant="outline" size="sm" onClick={onDown} disabled={last} aria-label="Mover para baixo">
      <ArrowDown className="w-4 h-4" />
    </Button>
  </div>
);

const PhotoPicker = ({
  label,
  onPick,
  multiple,
}: {
  label: string;
  onPick: (files: File[]) => void;
  multiple?: boolean;
}) => (
  <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-primary border border-primary/40 rounded-md px-3 py-1.5 hover:bg-primary/10">
    <ImagePlus className="w-4 h-4" /> {label}
    <input
      type="file"
      accept="image/*"
      multiple={multiple}
      className="sr-only"
      onChange={(e) => {
        const files = Array.from(e.target.files ?? []);
        e.target.value = '';
        if (files.length) onPick(files);
      }}
    />
  </label>
);

// ---------- Serviços ----------

const ServiceEditor = ({
  row,
  isNew,
  onChange,
  moveButtons,
}: {
  row: ServiceRow;
  isNew: boolean;
  onChange: () => void;
  moveButtons: ReactNode;
}) => {
  const [draft, setDraft] = useState(row);
  const [busy, setBusy] = useState(false);
  const dirty = isNew || JSON.stringify(draft) !== JSON.stringify(row);
  const set = <K extends keyof ServiceRow>(key: K, value: ServiceRow[K]) => setDraft((d) => ({ ...d, [key]: value }));

  useEffect(() => setDraft(row), [row]);

  const save = async () => {
    if (!draft.name.trim() || !(draft.price > 0) || !(draft.duration_minutes > 0)) {
      toast({
        title: 'Preencha nome, preço e duração',
        variant: 'destructive',
      });
      return;
    }
    setBusy(true);
    const ok = await run(async () => {
      const supabase = await getSupabase();
      check(
        await supabase.from('services').upsert({
          ...draft,
          name: draft.name.trim(),
          badge: draft.badge?.trim() || null,
        }),
      );
    }, 'Serviço salvo');
    setBusy(false);
    if (ok) onChange();
  };

  const remove = async () => {
    if (!isNew && !confirm(`Excluir o serviço "${row.name}"?`)) return;
    if (isNew) return onChange();
    if (
      await run(
        async () => check(await (await getSupabase()).from('services').delete().eq('id', row.id)),
        'Serviço excluído',
      )
    )
      onChange();
  };

  const pickImage = async ([file]: File[]) => {
    setBusy(true);
    await run(
      async () => set('image_url', (await uploadPhoto(file, 'servicos')).url),
      'Foto enviada — clique em Salvar',
    );
    setBusy(false);
  };

  return (
    <div
      className={`bg-card border rounded-xl p-4 md:p-5 ${draft.active ? 'border-border' : 'border-dashed border-border opacity-70'}`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-48 shrink-0 space-y-2">
          <div className="aspect-[3/2] rounded-lg overflow-hidden bg-secondary">
            {draft.image_url && <img src={draft.image_url} alt="" className="w-full h-full object-cover" />}
          </div>
          <PhotoPicker label="Trocar foto" onPick={pickImage} />
        </div>

        <div className="flex-1 grid sm:grid-cols-2 gap-3">
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor={`name-${row.id}`}>Nome</Label>
            <Input
              id={`name-${row.id}`}
              value={draft.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`price-${row.id}`}>Preço (R$)</Label>
            <Input
              id={`price-${row.id}`}
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={draft.price}
              onChange={(e) => set('price', Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`duration-${row.id}`}>Duração (minutos)</Label>
            <Input
              id={`duration-${row.id}`}
              type="number"
              inputMode="numeric"
              min={5}
              step={5}
              value={draft.duration_minutes}
              onChange={(e) => set('duration_minutes', Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor={`description-${row.id}`}>Descrição</Label>
            <Textarea
              id={`description-${row.id}`}
              value={draft.description}
              onChange={(e) => set('description', e.target.value)}
              className="w-full min-h-[70px]"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`badge-${row.id}`}>Selo (opcional)</Label>
            <Input
              id={`badge-${row.id}`}
              value={draft.badge ?? ''}
              onChange={(e) => set('badge', e.target.value)}
              placeholder="Ex.: Promoção, Novo, Semanal"
              className="w-full"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground self-end pb-2">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(e) => set('active', e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            Mostrar no site
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          {formatPrice(draft.price || 0)} · {formatDuration(draft.duration_minutes || 0)}
        </span>
        <div className="flex flex-wrap gap-2">
          {moveButtons}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={remove}
            disabled={busy}
            className="flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" /> Excluir
          </Button>
          <Button type="button" size="sm" onClick={save} disabled={busy || !dirty} className="flex items-center gap-1">
            <Save className="w-4 h-4" /> Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

const ServicesTab = () => {
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [draftNew, setDraftNew] = useState<ServiceRow | null>(null);

  const load = useCallback(async () => {
    await run(async () => {
      const { data } = check(await (await getSupabase()).from('services').select('*').order('sort'));
      setRows(data as ServiceRow[]);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addNew = () =>
    setDraftNew({
      id: `servico-${Date.now().toString(36)}`,
      name: '',
      description: '',
      price: 0,
      duration_minutes: 30,
      image_url: '',
      badge: null,
      active: true,
      sort: nextSort(rows),
    });

  const move = async (i: number, dir: -1 | 1) => {
    await run(() => swapSort('services', rows[i], rows[i + dir]));
    load();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Altere preços, duração, fotos e descrição. A duração define quais horários aparecem no agendamento.
      </p>
      {rows.map((row, i) => (
        <ServiceEditor
          key={row.id}
          row={row}
          isNew={false}
          onChange={load}
          moveButtons={
            <MoveButtons
              first={i === 0}
              last={i === rows.length - 1}
              onUp={() => move(i, -1)}
              onDown={() => move(i, 1)}
            />
          }
        />
      ))}
      {draftNew ? (
        <ServiceEditor
          row={draftNew}
          isNew
          onChange={() => {
            setDraftNew(null);
            load();
          }}
          moveButtons={null}
        />
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={addNew}
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar serviço
        </Button>
      )}
    </div>
  );
};

// ---------- Tipos de corte ----------

const CutsTab = () => {
  const [rows, setRows] = useState<CutTypeRow[]>([]);
  const [newName, setNewName] = useState('');

  const load = useCallback(async () => {
    await run(async () => {
      const { data } = check(await (await getSupabase()).from('cut_types').select('*').order('sort'));
      setRows(data as CutTypeRow[]);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const ok = await run(async () => {
      check(await (await getSupabase()).from('cut_types').insert({ name, sort: nextSort(rows) }));
    }, 'Tipo de corte adicionado');
    if (ok) {
      setNewName('');
      load();
    }
  };

  const rename = async (row: CutTypeRow, name: string) => {
    if (!name.trim() || name.trim() === row.name) return;
    await run(
      async () => check(await (await getSupabase()).from('cut_types').update({ name: name.trim() }).eq('id', row.id)),
      'Salvo',
    );
    load();
  };

  const remove = async (row: CutTypeRow) => {
    if (!confirm(`Remover "${row.name}"?`)) return;
    await run(async () => check(await (await getSupabase()).from('cut_types').delete().eq('id', row.id)));
    load();
  };

  const move = async (i: number, dir: -1 | 1) => {
    await run(() => swapSort('cut_types', rows[i], rows[i + dir]));
    load();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Opções do campo "Tipo de corte" no agendamento. Edite o texto e clique fora para salvar.
      </p>
      <form onSubmit={add} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Novo tipo de corte"
          className="flex-1"
        />
        <Button type="submit" className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Adicionar
        </Button>
      </form>
      <ul className="space-y-2">
        {rows.map((row, i) => (
          <li key={row.id} className="flex items-center gap-2 bg-card border border-border rounded-lg p-2">
            <Input
              defaultValue={row.name}
              key={row.name}
              onBlur={(e) => rename(row, e.target.value)}
              aria-label="Nome do tipo de corte"
              className="flex-1"
            />
            <MoveButtons
              first={i === 0}
              last={i === rows.length - 1}
              onUp={() => move(i, -1)}
              onDown={() => move(i, 1)}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(row)}
              aria-label={`Remover ${row.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---------- Galeria ----------

const GalleryTab = () => {
  const [rows, setRows] = useState<GalleryRow[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [uploading, setUploading] = useState(0);

  const load = useCallback(async () => {
    await run(async () => {
      const { data } = check(await (await getSupabase()).from('gallery').select('*').order('sort'));
      setRows(data as GalleryRow[]);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (files: File[]) => {
    setUploading(files.length);
    let sort = nextSort(rows);
    for (const file of files) {
      await run(async () => {
        const { url, path } = await uploadPhoto(file, 'galeria');
        check(
          await (await getSupabase()).from('gallery').insert({
            title: newTitle.trim(),
            image_url: url,
            storage_path: path,
            sort: sort++,
          }),
        );
      });
      setUploading((n) => n - 1);
    }
    setNewTitle('');
    toast({
      title: files.length > 1 ? 'Fotos adicionadas' : 'Foto adicionada',
    });
    load();
  };

  const rename = async (row: GalleryRow, title: string) => {
    if (title.trim() === row.title) return;
    await run(
      async () => check(await (await getSupabase()).from('gallery').update({ title: title.trim() }).eq('id', row.id)),
      'Salvo',
    );
    load();
  };

  const remove = async (row: GalleryRow) => {
    if (!confirm('Excluir esta foto da galeria?')) return;
    await run(async () => {
      check(await (await getSupabase()).from('gallery').delete().eq('id', row.id));
      await deletePhoto(row.storage_path);
    }, 'Foto excluída');
    load();
  };

  const move = async (i: number, dir: -1 | 1) => {
    await run(() => swapSort('gallery', rows[i], rows[i + dir]));
    load();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Fotos dos cortes reais. As fotos são reduzidas automaticamente antes do envio. Digite o título antes de escolher
        as fotos (ex.: "Low fade com risco").
      </p>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center bg-card border border-border rounded-lg p-3">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Título da foto (opcional)"
          className="flex-1"
        />
        <PhotoPicker label={uploading ? `Enviando ${uploading}…` : 'Adicionar fotos'} onPick={upload} multiple />
      </div>
      {!rows.length && (
        <p className="text-sm text-muted-foreground">
          Nenhuma foto ainda — a galeria fica escondida no site até ter fotos.
        </p>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((row, i) => (
          <div key={row.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <img src={row.image_url} alt={row.title} className="w-full aspect-[4/3] object-cover" />
            <div className="p-3 space-y-2">
              <Input
                defaultValue={row.title}
                key={row.title}
                onBlur={(e) => rename(row, e.target.value)}
                placeholder="Título"
                aria-label="Título da foto"
                className="w-full"
              />
              <div className="flex justify-between">
                <MoveButtons
                  first={i === 0}
                  last={i === rows.length - 1}
                  onUp={() => move(i, -1)}
                  onDown={() => move(i, 1)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(row)}
                  aria-label="Excluir foto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- Página ----------

const tabs: { id: Tab; label: string }[] = [
  { id: 'services', label: 'Serviços e preços' },
  { id: 'cuts', label: 'Tipos de corte' },
  { id: 'gallery', label: 'Galeria' },
];

const Admin = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>('services');

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    document.title = `Admin | ${business.name}`;
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let unsubscribe = () => {};
    getSupabase().then((supabase) => {
      supabase.auth.getSession().then(({ data }) => setSession(data.session));
      const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
      unsubscribe = () => data.subscription.unsubscribe();
    });
    return () => unsubscribe();
  }, []);

  if (!isSupabaseConfigured)
    return (
      <Shell>
        <NotConfigured />
      </Shell>
    );
  if (session === undefined)
    return (
      <Shell>
        <p className="text-muted-foreground">Carregando…</p>
      </Shell>
    );
  if (!session)
    return (
      <Shell>
        <Login />
      </Shell>
    );

  const signOut = async () => (await getSupabase()).auth.signOut();

  return (
    <Shell onSignOut={signOut}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Painel da barbearia</h1>
        <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
          Ver o site ↗
        </a>
      </div>
      <nav className="flex gap-2 mb-6 overflow-x-auto" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              tab === t.id
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      {tab === 'services' && <ServicesTab />}
      {tab === 'cuts' && <CutsTab />}
      {tab === 'gallery' && <GalleryTab />}
    </Shell>
  );
};

export default Admin;
