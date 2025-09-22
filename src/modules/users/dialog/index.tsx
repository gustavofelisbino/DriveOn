import * as React from 'react';
import {
  Dialog, DialogContent, DialogActions, Tabs, Tab, Box, Stack, Paper,
  TextField, Button, IconButton, Typography, MenuItem, InputAdornment,
  Grid, Divider, Avatar, Switch, FormControlLabel, Tooltip
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { required } from 'zod/mini';

// ==================== Tipos ====================
export type User = {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  maritalStatus?: string;
  gender?: string;
  nationality?: string;
  address?: { street?: string; city?: string; state?: string; zip?: string };
  job?: {
    role?: string; department?: string; hireDate?: string;
    employmentType?: 'CLT' | 'PJ' | 'Estágio' | 'Temporário';
    salary?: number; manager?: string;
  };
  documents?: { cpf?: string; rg?: string; cnh?: string; cnhExpiry?: string };
  access?: { username?: string; profile?: 'Admin' | 'Mecânico' | 'Atendente'; senha?: string; active?: boolean; requirePasswordReset?: boolean };
  avatarUrl?: string;
  createdAt: string;
};

export type UserForm = {
  // pessoais
  firstName: string; lastName?: string; email?: string; phone?: string;
  birthDate?: Dayjs | null; maritalStatus?: string; gender?: string; nationality?: string;
  street?: string; city?: string; state?: string; zip?: string; avatarFile?: File | null;
  // profissionais
  role?: string; department?: string; hireDate?: Dayjs | null;
  employmentType?: 'CLT' | 'PJ' | 'Estágio' | 'Temporário'; salary?: number | ''; manager?: string;
  // documentos
  cpf?: string; rg?: string; cnh?: string; cnhExpiry?: Dayjs | null;
  // acesso
  username?: string; profile?: 'Admin' | 'Mecânico' | 'Atendente'; senha?: string; active?: boolean; requirePasswordReset?: boolean;
};

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: User | null;
  onClose: () => void;
  onSubmit: (data: UserForm) => void;
  onDelete?: (user: User) => void;
};

// ==================== Helpers ====================
const maritalOptions = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)'];
const genderOptions = ['Masculino', 'Feminino'];
const brStates = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];
const employmentTypes = ['CLT','PJ','Estágio','Temporário'] as const;
const profiles = ['Admin', 'Mecânico', 'Atendente'] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const onlyDigits = (s?: string) => (s || '').replace(/\D/g, '');
const maskPhone = (s?: string) => {
  const d = onlyDigits(s).slice(0, 11);
  if (!d) return '';
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{0,4})$/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{0,4})$/, '$1-$2');
};
const maskCEP = (s?: string) => onlyDigits(s).slice(0, 8).replace(/(\d{5})(\d{0,3})/, '$1-$2');

function TabPanel({ index, value, children }: React.PropsWithChildren<{index: number; value: number;}>) {
  return <div role="tabpanel" hidden={value !== index}>{value === index && <Box sx={{ pt: 2 }}>{children}</Box>}</div>;
}

function HeaderIcon({ children }: { children: React.ReactNode }) {
  return (
    <Stack
      sx={{
        width: 36, height: 36, borderRadius: '50%', display: 'grid', placeItems: 'center',
        bgcolor: (t) => alpha(t.palette.primary.main, 0.15), color: 'primary.main', flexShrink: 0
      }}
    >
      {children}
    </Stack>
  );
}

// ==================== Componente ====================
export default function UserDialog({ open, mode, initial, onClose, onSubmit, onDelete }: Props) {
  const [tab, setTab] = React.useState(0);
  const [avatarPreview, setAvatarPreview] = React.useState<string | undefined>(initial?.avatarUrl);

  const { control, handleSubmit, reset, watch, setValue,
    formState: { errors, isValid, isSubmitting } } = useForm<UserForm>({
    mode: 'onChange',
    defaultValues: {
      // pessoais
      firstName: initial?.firstName ?? '', lastName: initial?.lastName ?? '',
      email: initial?.email ?? '', phone: initial?.phone ?? '',
      birthDate: initial?.birthDate ? dayjs(initial.birthDate) : null,
      maritalStatus: initial?.maritalStatus ?? '', gender: initial?.gender ?? '',
      nationality: initial?.nationality ?? '',
      street: initial?.address?.street ?? '', city: initial?.address?.city ?? '',
      state: initial?.address?.state ?? '', zip: initial?.address?.zip ?? '',
      avatarFile: null,
      // profissionais
      role: initial?.job?.role ?? '', department: initial?.job?.department ?? '',
      hireDate: initial?.job?.hireDate ? dayjs(initial?.job?.hireDate) : null,
      employmentType: (initial?.job?.employmentType ?? 'CLT') as UserForm['employmentType'],
      salary: initial?.job?.salary ?? '', manager: initial?.job?.manager ?? '',
      // documentos
      cpf: initial?.documents?.cpf ?? '', rg: initial?.documents?.rg ?? '',
      cnh: initial?.documents?.cnh ?? '',
      cnhExpiry: initial?.documents?.cnhExpiry ? dayjs(initial?.documents?.cnhExpiry) : null,
      // acesso
      username: initial?.access?.username ?? initial?.email ?? '',
      profile: (initial?.access?.profile ?? 'Mecânico') as UserForm['profile'],
      active: initial?.access?.active ?? true,
      requirePasswordReset: initial?.access?.requirePasswordReset ?? (mode === 'create'),
    },
  });

  // reseta ao abrir
  React.useEffect(() => {
    if (!open) return;
    setTab(0);
    setAvatarPreview(initial?.avatarUrl);
    reset({
      firstName: initial?.firstName ?? '', lastName: initial?.lastName ?? '',
      email: initial?.email ?? '', phone: initial?.phone ?? '',
      birthDate: initial?.birthDate ? dayjs(initial.birthDate) : null,
      maritalStatus: initial?.maritalStatus ?? '', gender: initial?.gender ?? '',
      nationality: initial?.nationality ?? '',
      street: initial?.address?.street ?? '', city: initial?.address?.city ?? '',
      state: initial?.address?.state ?? '', zip: initial?.address?.zip ?? '',
      avatarFile: null,
      role: initial?.job?.role ?? '', department: initial?.job?.department ?? '',
      hireDate: initial?.job?.hireDate ? dayjs(initial?.job?.hireDate) : null,
      employmentType: (initial?.job?.employmentType ?? 'CLT') as UserForm['employmentType'],
      salary: initial?.job?.salary ?? '', manager: initial?.job?.manager ?? '',
      cpf: initial?.documents?.cpf ?? '', rg: initial?.documents?.rg ?? '',
      cnh: initial?.documents?.cnh ?? '',
      cnhExpiry: initial?.documents?.cnhExpiry ? dayjs(initial?.documents?.cnhExpiry) : null,
      username: initial?.access?.username ?? initial?.email ?? '',
      profile: (initial?.access?.profile ?? 'Mecânico') as UserForm['profile'],
      active: initial?.access?.active ?? true,
      requirePasswordReset: initial?.access?.requirePasswordReset ?? (mode === 'create'),
    });
  }, [open, initial, mode, reset]);

  // sugere username = email
  const email = watch('email');
  React.useEffect(() => {
    if (email && !watch('username')) setValue('username', email);
  }, [email, setValue, watch]);

  const onLocalSubmit = handleSubmit((data) => { onSubmit(data); onClose(); });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue('avatarFile', file);
    if (file) setAvatarPreview(URL.createObjectURL(file)); else setAvatarPreview(undefined);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md"
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>
        {/* Header */}
        <Paper elevation={0} square sx={{
          px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          bgcolor: (t) => alpha(t.palette.primary.main, 0.06)
        }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <HeaderIcon><PersonRoundedIcon /></HeaderIcon>
            <Stack spacing={0}>
              <Typography variant="subtitle1" fontWeight={800}>
                {mode === 'create' ? 'Novo usuário' : 'Editar usuário'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preencha as informações e avance para salvar
              </Typography>
            </Stack>
          </Stack>
          <IconButton onClick={onClose} size="small"><CloseRoundedIcon /></IconButton>
        </Paper>

        {/* Tabs */}
        <Box sx={{ px: 2.5, pt: 1 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" allowScrollButtonsMobile>
            <Tab icon={<PersonRoundedIcon />} iconPosition="start" label="Informações pessoais" />
            <Tab icon={<WorkRoundedIcon />} iconPosition="start" label="Informações profissionais" />
            <Tab icon={<DescriptionRoundedIcon />} iconPosition="start" label="Documentos" />
            <Tab icon={<LockRoundedIcon />} iconPosition="start" label="Acesso à conta" />
          </Tabs>
        </Box>

        <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
          <TabPanel value={tab} index={0}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                <Paper
                  variant="outlined"
                  sx={{ borderRadius: 2, p: 2, display: 'grid', placeItems: 'center', bgcolor: 'background.default', width: 300 }}
                >
                  <Avatar src={avatarPreview} sx={{ width: 76, height: 76 }} />
                  <Tooltip title="Selecionar foto">
                    <Button size="small" startIcon={<UploadRoundedIcon />} component="label">
                      Upload
                      <input hidden type="file" accept="image/*" onChange={handleAvatarChange} />
                      </Button>
                    </Tooltip>
                    {avatarPreview && (
                      <Button size="small" color="error" startIcon={<DeleteRoundedIcon />}
                        onClick={() => { setAvatarPreview(undefined); setValue('avatarFile', null); }}>
                        Remover
                      </Button>
                    )}
                </Paper>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid item xs={12} md={4} width={515}>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{ required: 'Informe o primeiro nome' }}
                      render={({ field }) => (
                        <TextField {...field} label="Primeiro nome" size="small" fullWidth
                          error={!!errors.firstName} helperText={errors.firstName?.message} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller name="lastName" control={control}
                      render={({ field }) => (<TextField {...field} label="Último nome" size="small" fullWidth />)} />
                  </Grid>
                  <Grid item xs={12} md={4} width={'100%'}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Telefone"
                          size="small"
                          fullWidth
                          value={maskPhone(field.value)}
                          onChange={(e) => field.onChange(onlyDigits(e.target.value))}
                          InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIphoneRoundedIcon fontSize="small" /></InputAdornment> }}
                        />
                      )}
                    />
                  </Grid>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ validate: (v) => !v || emailPattern.test(v) || 'E-mail inválido' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="E-mail"
                          size="small"
                          fullWidth
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          InputProps={{ startAdornment: <InputAdornment position="start"><EmailRoundedIcon fontSize="small" /></InputAdornment> }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="birthDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="Data de nascimento"
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              size: 'small',
                              fullWidth: true,
                              InputProps: { startAdornment: <InputAdornment position="start"><CalendarMonthRoundedIcon fontSize="small" /></InputAdornment> },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} width={150}>
                    <Controller name="maritalStatus" control={control}
                      render={({ field }) => (
                        <TextField {...field} select label="Estado civil" size="small" fullWidth>
                          {maritalOptions.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} width={120}>
                    <Controller name="gender" control={control}
                      render={({ field }) => (
                        <TextField {...field} select label="Gênero" size="small" fullWidth>
                          {genderOptions.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} width={150}>
                    <Controller name="nationality" control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Nacionalidade"
                          size="small"
                          fullWidth
                          InputProps={{ startAdornment: <InputAdornment position="start"><PublicRoundedIcon fontSize="small" /></InputAdornment> }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} width={200}>
                    <Controller name="street" control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Endereço"
                          size="small"
                          fullWidth
                          InputProps={{ startAdornment: <InputAdornment position="start"><PlaceRoundedIcon fontSize="small" /></InputAdornment> }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} width={150}>
                    <Controller name="city" control={control}
                      render={({ field }) => (<TextField {...field} label="Cidade" size="small" fullWidth />)} />
                  </Grid>
                  <Grid item xs={6} md={3} width={100}>
                    <Controller name="state" control={control}
                      render={({ field }) => (
                        <TextField {...field} select label="Estado" size="small" fullWidth>
                          {brStates.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} md={3} width={170}>
                    <Controller name="zip" control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="CEP"
                          size="small"
                          fullWidth
                          value={maskCEP(field.value)}
                          onChange={(e) => field.onChange(onlyDigits(e.target.value))}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} width={400}>
                <Controller name="role" control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Cargo" size="small" fullWidth
                      InputProps={{ startAdornment: <InputAdornment position="start"><BadgeRoundedIcon fontSize="small" /></InputAdornment> }} />
                  )} />
              </Grid>
              <Grid item xs={12} md={6} width={400}>
                <Controller name="department" control={control}
                  render={({ field }) => (<TextField {...field} label="Departamento" size="small" fullWidth />)} />
              </Grid>

              <Grid item xs={12} md={4} width={300}>
                <Controller name="hireDate" control={control}
                  render={({ field }) => (
                    <DatePicker {...field} label="Data de admissão" format="DD/MM/YYYY"
                      slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                  )} />
              </Grid>
              <Grid item xs={12} md={4} width={80}>
                <Controller name="employmentType" control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Tipo de contratação" size="small" fullWidth>
                      {employmentTypes.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
                    </TextField>
                  )} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller name="salary" control={control}
                  rules={{ validate: (v) => (!v || Number(v) >= 0) || 'Valor inválido' }}
                  render={({ field }) => (
                    <TextField {...field} type="number" label="Salário (R$)" size="small" fullWidth
                      error={!!errors.salary} helperText={errors.salary?.message as string | undefined} />
                  )} />
              </Grid>

              <Grid item xs={12} md={6} width={180}>
                <Controller name="manager" control={control}
                  render={({ field }) => (<TextField {...field} label="Gestor (opcional)" size="small" fullWidth />)} />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} width={200}>
                <Controller name="cpf" control={control}
                  render={({ field }) => (
                    <TextField {...field} label="CPF" size="small" fullWidth
                      InputProps={{ startAdornment: <InputAdornment position="start"><CreditCardRoundedIcon fontSize="small" /></InputAdornment> }} />
                  )} />
              </Grid>
              <Grid item xs={12} md={4} width={200}>
                <Controller name="rg" control={control}
                  render={({ field }) => (<TextField {...field} label="RG" size="small" fullWidth />)} />
              </Grid>
              <Grid item xs={12} md={4} width={200}>
                <Controller name="cnh" control={control}
                  render={({ field }) => (<TextField {...field} label="CNH" size="small" fullWidth />)} />
              </Grid>
              <Grid item xs={12} md={4} width={200}>
                <Controller name="cnhExpiry" control={control}
                  render={({ field }) => (
                    <DatePicker {...field} label="Validade da CNH" format="DD/MM/YYYY"
                      slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                  )} />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tab} index={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller name="username" control={control} rules={{ required: 'Informe um usuário/e-mail' }}
                  render={({ field }) => (
                    <TextField {...field} label="Usuário (e-mail)" size="small" fullWidth
                      error={!!errors.username} helperText={errors.username?.message} />
                  )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="profile" control={control} rules={{ required: 'Selecione o perfil' }}
                  render={({ field }) => (
                    <TextField {...field} select label="Perfil" size="small" fullWidth
                      error={!!errors.profile} helperText={errors.profile?.toString()}>
                      {profiles.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </TextField>
                  )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="senha" control={control} rules={{ required: 'Informe uma senha'}}
                    render={({ field }) => (
                        <TextField {...field} label="Senha" size="small" fullWidth
                        error={!!errors.senha} helperText={errors.senha?.message} />
                    )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller name="active" control={control}
                  render={({ field }) => (
                    <FormControlLabel control={<Switch checked={!!field.value} onChange={(_, v) => field.onChange(v)} />} label="Usuário ativo" />
                  )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="requirePasswordReset" control={control}
                  render={({ field }) => (
                    <FormControlLabel control={<Switch checked={!!field.value} onChange={(_, v) => field.onChange(v)} />} label="Exigir troca de senha no próximo acesso" />
                  )} />
              </Grid>
            </Grid>
          </TabPanel>
        </DialogContent>

        <Divider />

        {/* Footer */}
        <DialogActions sx={{ px: 3, py: 2 }}>
          {mode === 'edit' && onDelete && initial?.id && (
            <Button color="error" onClick={() => { onDelete(initial!); onClose(); }}>
              Excluir
            </Button>
          )}
          <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
            <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 999 }}>Cancelar</Button>
            {tab > 0 && <Button onClick={() => setTab((t) => t - 1)} sx={{ borderRadius: 999 }}>Voltar</Button>}
            {tab < 3 ? (
              <Button variant="contained" onClick={() => setTab((t) => t + 1)} sx={{ borderRadius: 999 }}>Próximo</Button>
            ) : (
              <Button variant="contained" onClick={onLocalSubmit} disabled={isSubmitting || !isValid} sx={{ borderRadius: 999 }}>Salvar</Button>
            )}
          </Stack>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
