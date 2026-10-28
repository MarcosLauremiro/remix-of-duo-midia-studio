/** Valores editáveis do cliente no formulário. Novos campos entram aqui e em ClienteFormValues. */
export type ClienteFormValues = {
  nome: string;
  dataInicioContrato: string;
};

type Props = {
  values: ClienteFormValues;
  onChange: (values: ClienteFormValues) => void;
  disabled?: boolean;
};

const inputClass =
  "mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-terracotta/20";

/** Campos do cadastro de cliente. Quem usa fornece o <form> e os botões. */
export function ClienteFormFields({ values, onChange, disabled }: Props) {
  const set = <K extends keyof ClienteFormValues>(key: K, value: ClienteFormValues[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block text-sm sm:col-span-2">
        <span className="font-medium text-ink">Nome *</span>
        <input
          value={values.nome}
          onChange={(e) => set("nome", e.target.value)}
          required
          minLength={2}
          maxLength={120}
          disabled={disabled}
          className={inputClass}
        />
      </label>
      <label className="block text-sm">
        <span className="text-ink">Início do contrato</span>
        <input
          type="date"
          value={values.dataInicioContrato}
          onChange={(e) => set("dataInicioContrato", e.target.value)}
          disabled={disabled}
          className={inputClass}
        />
      </label>
    </div>
  );
}
