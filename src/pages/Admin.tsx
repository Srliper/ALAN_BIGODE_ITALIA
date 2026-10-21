import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ArrowDown, ArrowUp, Crown, ImagePlus, Instagram, LogOut, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { business, formatPrice, instagramHandle, instagramUrl } from '@/config';
import { formatDuration } from '@/data/services';
import { defaultTeam, isOwner } from '@/data/team';
import { deletePhoto, uploadPhoto } from '@/lib/images';
import {
  getSupabase,
  isSupabaseConfigured,
  type CutTypeRow,
  type GalleryRow,
  type ServiceRow,
  type TeamRow,
} from '@/lib/supabase';

type Tab = 'help' | 'services' | 'cuts' | 'gallery' | 'team';

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

// Com VITE_ADMIN_EMAIL definido, o login pede só a senha
const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

const Login = () => {
  const [email, setEmail] = useState(adminEmail ?? '');
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
      if (error) throw new Error(adminEmail ? 'Senha incorreta.' : 'E-mail ou senha incorretos.');
    });
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto bg-card border border-border rounded-xl p-6 space-y-4 mt-10"
    >
      <h1 className="text-2xl font-bold text-foreground">Entrar no painel</h1>
      {adminEmail ? (
        // Campo escondido para o gerenciador de senhas do navegador saber de qual conta é a senha
        <input type="email" autoComplete="username" value={email} readOnly hidden />
      ) : (
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
      )}
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
              className="flex-1 min-w-0"
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

// ---------- Equipe ----------

type TeamDraft = Omit<TeamRow, 'id'> & { id?: number };

const TeamEditor = ({
  row,
  onChange,
  moveButtons,
}: {
  row: TeamDraft;
  onChange: () => void;
  moveButtons: ReactNode;
}) => {
  const [draft, setDraft] = useState(row);
  const [busy, setBusy] = useState(false);
  const isNew = row.id === undefined;
  const dirty = isNew || JSON.stringify(draft) !== JSON.stringify(row);
  const key = row.id ?? 'novo';
  const set = <K extends keyof TeamDraft>(field: K, value: TeamDraft[K]) => setDraft((d) => ({ ...d, [field]: value }));

  useEffect(() => setDraft(row), [row]);

  const save = async () => {
    if (!draft.name.trim() || !draft.role.trim()) {
      toast({ title: 'Preencha nome e cargo', variant: 'destructive' });
      return;
    }
    setBusy(true);
    const ok = await run(async () => {
      const supabase = await getSupabase();
      const data = {
        ...draft,
        name: draft.name.trim(),
        role: draft.role.trim(),
        instagram: instagramUrl(draft.instagram),
      };
      check(await (isNew ? supabase.from('team').insert(data) : supabase.from('team').update(data).eq('id', row.id)));
    }, 'Perfil salvo');
    setBusy(false);
    if (ok) onChange();
  };

  const remove = async () => {
    if (isNew) return onChange();
    if (!confirm(`Remover ${row.name} da equipe?`)) return;
    const ok = await run(async () => {
      check(await (await getSupabase()).from('team').delete().eq('id', row.id));
      await deletePhoto(row.storage_path);
    }, 'Perfil removido');
    if (ok) onChange();
  };

  const pickPhoto = async ([file]: File[]) => {
    setBusy(true);
    await run(async () => {
      const { url, path } = await uploadPhoto(file, 'equipe');
      setDraft((d) => ({ ...d, photo_url: url, storage_path: path }));
    }, 'Foto enviada — clique em Salvar');
    setBusy(false);
  };

  return (
    <div className={`bg-card border rounded-xl p-4 md:p-5 ${isOwner(draft) ? 'border-primary/60' : 'border-border'}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="shrink-0 flex flex-col items-center gap-2">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-secondary border-2 border-primary flex items-center justify-center">
              {draft.photo_url ? (
                <img src={draft.photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-3xl font-bold text-gradient-gold">
                  {draft.name.charAt(0) || '?'}
                </span>
              )}
            </div>
            {isOwner(draft) && (
              <span className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center">
                <Crown className="w-4 h-4 text-primary-foreground" />
              </span>
            )}
          </div>
          <PhotoPicker label="Trocar foto" onPick={pickPhoto} />
        </div>

        <div className="flex-1 grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor={`team-name-${key}`}>Nome</Label>
            <Input
              id={`team-name-${key}`}
              value={draft.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`team-role-${key}`}>Cargo</Label>
            <Input
              id={`team-role-${key}`}
              value={draft.role}
              onChange={(e) => set('role', e.target.value)}
              placeholder="Ex.: Dono, Barbeiro"
              className="w-full"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor={`team-instagram-${key}`}>Instagram</Label>
            <Input
              id={`team-instagram-${key}`}
              value={draft.instagram}
              onChange={(e) => set('instagram', e.target.value)}
              placeholder="@usuario ou link do perfil"
              className="w-full"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor={`team-bio-${key}`}>Sobre (aparece no site)</Label>
            <Textarea
              id={`team-bio-${key}`}
              value={draft.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Ex.: 15 anos de experiência, especialista em fade e barba."
              className="w-full min-h-[70px]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
        {moveButtons}
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={remove}
          disabled={busy}
          className="flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Remover
        </Button>
        <Button type="button" size="sm" onClick={save} disabled={busy || !dirty} className="flex items-center gap-1">
          <Save className="w-4 h-4" /> Salvar
        </Button>
      </div>
    </div>
  );
};

const TeamTab = () => {
  const [rows, setRows] = useState<TeamRow[]>([]);
  const [draftNew, setDraftNew] = useState<TeamDraft | null>(null);

  const load = useCallback(async () => {
    await run(async () => {
      const { data } = check(await (await getSupabase()).from('team').select('*').order('sort'));
      setRows(data as TeamRow[]);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const move = async (i: number, dir: -1 | 1) => {
    await run(() => swapSort('team', rows[i], rows[i + dir]));
    load();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Perfis que aparecem na seção "Nossa Equipe" do site. Quem tem "Dono" no cargo ganha a coroa dourada.
      </p>
      {rows.map((row, i) => (
        <TeamEditor
          key={row.id}
          row={row}
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
        <TeamEditor
          row={draftNew}
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
          onClick={() =>
            setDraftNew({
              name: '',
              role: 'Barbeiro',
              bio: '',
              instagram: '',
              photo_url: '',
              storage_path: null,
              sort: nextSort(rows),
            })
          }
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar pessoa
        </Button>
      )}
    </div>
  );
};

// Cartão do dono no topo do painel
const OwnerCard = () => {
  const [owner, setOwner] = useState<{ name: string; role: string; instagram: string; photo: string }>({
    ...defaultTeam[0],
  });

  useEffect(() => {
    getSupabase()
      .then((supabase) => supabase.from('team').select('*').order('sort'))
      .then(({ data }) => {
        const row = (data as TeamRow[] | null)?.find(isOwner);
        if (row) setOwner({ name: row.name, role: row.role, instagram: row.instagram, photo: row.photo_url });
      });
  }, []);

  return (
    <div className="flex items-center gap-4 bg-gradient-card border border-primary/40 rounded-2xl p-4 mb-6">
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary border-2 border-primary flex items-center justify-center">
          {owner.photo ? (
            <img src={owner.photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="font-display text-2xl font-bold text-gradient-gold">{owner.name.charAt(0)}</span>
          )}
        </div>
        <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center">
          <Crown className="w-3.5 h-3.5 text-primary-foreground" />
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-foreground">Olá, {owner.name.split(' ')[0]}!</p>
        <p className="text-sm text-muted-foreground">
          {owner.name} · <span className="text-primary font-semibold">{owner.role}</span> da {business.name}
        </p>
        {owner.instagram && (
          <a
            href={owner.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Instagram className="w-4 h-4" /> {instagramHandle(owner.instagram)}
          </a>
        )}
      </div>
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

// ---------- Como usar ----------

const HelpStep = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <li className="flex gap-4 bg-card border border-border rounded-xl p-4 md:p-5">
    <span className="shrink-0 w-8 h-8 rounded-full bg-gradient-gold text-primary-foreground font-bold flex items-center justify-center">
      {n}
    </span>
    <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  </li>
);

const HelpTab = ({ goTo }: { goTo: (tab: Tab) => void }) => {
  const link = (tab: Tab, label: string) => (
    <button type="button" onClick={() => goTo(tab)} className="text-primary font-semibold hover:underline">
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Bem-vindo ao painel! Tudo o que você alterar aqui aparece no site na hora, para todos os clientes. Siga os
        passos abaixo:
      </p>
      <ol className="space-y-3">
        <HelpStep n={1} title="Alterar preços e serviços">
          <p>Abra a aba {link('services', 'Serviços e preços')}. Cada serviço tem um cartão:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Mude o <b>preço</b>, a <b>duração</b> (em minutos), o nome ou a descrição.
            </li>
            <li>
              Clique em <b>Salvar</b> no cartão. O botão só acende quando há alguma mudança.
            </li>
            <li>
              A duração decide os horários do agendamento: um serviço de 90 min não aparece às 20:30, porque passaria do
              fechamento.
            </li>
            <li>
              <b>Selo</b> (opcional) é a etiqueta dourada em cima da foto, ex.: "Promoção" ou "Novo". Use "Semanal" para
              o cliente ser avisado de que o horário se repete toda semana.
            </li>
            <li>
              Desmarque <b>Mostrar no site</b> para esconder um serviço sem apagar (ex.: fora de temporada).
            </li>
            <li>
              Use <b>Adicionar serviço</b> no fim da lista para criar um novo, e as setas ↑ ↓ para mudar a ordem.
            </li>
          </ul>
        </HelpStep>
        <HelpStep n={2} title="Trocar a foto de um serviço">
          <p>
            No cartão do serviço, toque em <b>Trocar foto</b>, escolha a foto (pelo celular pode tirar na hora) e depois
            clique em <b>Salvar</b>. A foto é reduzida automaticamente, então pode mandar a original da câmera.
          </p>
        </HelpStep>
        <HelpStep n={3} title="Colocar fotos dos cortes na galeria">
          <p>Abra a aba {link('gallery', 'Galeria')}:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Digite um título (ex.: "Low fade com risco") e toque em <b>Adicionar fotos</b>. Dá para escolher várias de
              uma vez; todas recebem o mesmo título.
            </li>
            <li>Para mudar um título, edite o texto embaixo da foto e toque fora do campo; ele salva sozinho.</li>
            <li>Use as setas para escolher quais fotos aparecem primeiro e a lixeira para excluir.</li>
            <li>Dica: fotos bem iluminadas, de lado e de costas, mostram melhor o acabamento.</li>
          </ul>
        </HelpStep>
        <HelpStep n={4} title="Tipos de corte do agendamento">
          <p>
            Na aba {link('cuts', 'Tipos de corte')} ficam as opções que o cliente escolhe ao agendar. Escreva um novo e
            clique em <b>Adicionar</b>. Para renomear, edite e toque fora do campo. Setas mudam a ordem; a lixeira
            remove.
          </p>
        </HelpStep>
        <HelpStep n={5} title="Equipe e perfil do dono">
          <p>
            Na aba {link('team', 'Equipe')} ficam os perfis da seção "Nossa Equipe" do site. Troque a foto, escreva um
            texto sobre a pessoa e coloque o Instagram (pode ser só o <b>@usuario</b>). Quem tem "Dono" no cargo ganha a
            coroa dourada. Use <b>Adicionar pessoa</b> para incluir novos barbeiros.
          </p>
        </HelpStep>
        <HelpStep n={6} title="Conferir no site e sair">
          <p>
            Clique em <b>Ver o site ↗</b> para conferir as mudanças. Quando terminar, clique em <b>Sair</b>,
            principalmente se estiver num computador ou celular de outra pessoa.
          </p>
        </HelpStep>
      </ol>
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-sm text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground">O que não fica no painel</p>
        <p>
          Telefone, endereço e horário de funcionamento são alterados no código (arquivo <code>src/config.ts</code>). Os
          agendamentos continuam chegando pelo WhatsApp.
        </p>
      </div>
      <Button type="button" onClick={() => goTo('services')} className="w-full">
        Começar pelos serviços e preços
      </Button>
    </div>
  );
};

// Na primeira vez, o painel abre no tutorial
const TUTORIAL_KEY = 'admin-tutorial-visto';

const initialTab = (): Tab => {
  try {
    return localStorage.getItem(TUTORIAL_KEY) ? 'services' : 'help';
  } catch {
    return 'help';
  }
};

const markTutorialSeen = () => {
  try {
    localStorage.setItem(TUTORIAL_KEY, '1');
  } catch {
    // sem armazenamento local: o tutorial volta a abrir na próxima vez
  }
};

const tabs: { id: Tab; label: string }[] = [
  { id: 'help', label: 'Como usar' },
  { id: 'services', label: 'Serviços e preços' },
  { id: 'cuts', label: 'Tipos de corte' },
  { id: 'gallery', label: 'Galeria' },
  { id: 'team', label: 'Equipe' },
];

const Admin = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    document.title = `Admin | ${business.name}`;
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (session) markTutorialSeen();
  }, [session]);

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
      <OwnerCard />
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
      {tab === 'help' && <HelpTab goTo={setTab} />}
      {tab === 'services' && <ServicesTab />}
      {tab === 'cuts' && <CutsTab />}
      {tab === 'gallery' && <GalleryTab />}
      {tab === 'team' && <TeamTab />}
    </Shell>
  );
};

export default Admin;
