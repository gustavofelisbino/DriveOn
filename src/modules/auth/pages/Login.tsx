import { Box, Paper, TextField, Button, Typography, Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, MenuItem } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../routes/paths';
import logo from '../../../assets/logo.png';
import mechanic from '../../../assets/mechanic.png';

export default function Login() {
  const { signIn, signInWithCompany } = useAuth();
  const nav = useNavigate();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('admin@teste.com');        // ajuste conforme seu usuário
  const [password, setPassword] = useState('SenhaForte123!');   // ajuste conforme sua senha
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [empresaChoices, setEmpresaChoices] = useState<{ id: number; nome: string }[] | null>(null);
  const [empresaIdSelecionada, setEmpresaIdSelecionada] = useState<number | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn(email, password, remember);
      if (result && 'code' in result && result.code === 'MULTIPLE_COMPANIES') {
        setEmpresaChoices(result.empresas);
        setEmpresaIdSelecionada('');
        setError('Selecione a empresa para continuar.');
        return;
      }
      nav(paths.root);
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível entrar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresaIdSelecionada || typeof empresaIdSelecionada !== 'number') {
      setError('Selecione uma empresa.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signInWithCompany(email, password, empresaIdSelecionada, remember);
      nav(paths.root);
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 1,
      height: 48,
      width: '100%',
    },
    '& .MuiInputLabel-root': {
      fontSize: 12,
      fontWeight: 500,
      color: 'text.primary'
    },
  } as const;

  const empresaSelector = empresaChoices && (
    <TextField
      select
      label="Empresa"
      fullWidth
      value={empresaIdSelecionada}
      onChange={(e) => setEmpresaIdSelecionada(Number(e.target.value))}
      sx={fieldSx}
      helperText="Seu e-mail existe em mais de uma empresa — selecione a correta."
    >
      {empresaChoices.map((c) => (
        <MenuItem key={c.id} value={c.id}>{c.nome} (#{c.id})</MenuItem>
      ))}
    </TextField>
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2.5, md: 8 },
        }}
      >
        <Paper elevation={0} sx={{ width: '100%', maxWidth: 520, bgcolor: 'transparent' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img src={logo} alt="Logo da empresa" width={180} style={{ display: 'inline-block' }} />
          </Box>

          <form onSubmit={empresaChoices ? handleSubmitComEmpresa : handleSubmit} noValidate>
            <TextField
              label="Endereço de e-mail"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={fieldSx}
              autoComplete="email"
            />

            <TextField
              label="Senha"
              fullWidth
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ ...fieldSx, mb: 1.5 }}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShow((s) => !s)} edge="end">
                      {show ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {empresaSelector}

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <FormControlLabel
                control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
                label="Lembrar-me"
              />
              <Button variant="text" sx={{ textTransform: 'none', p: 0, minWidth: 0 }}>
                Esqueceu sua senha?
              </Button>
            </Stack>

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="medium"
              disabled={loading}
              sx={{ height: 50, borderRadius: 2, fontWeight: 700 }}
            >
              {loading ? 'Entrando…' : empresaChoices ? 'Entrar na empresa selecionada' : 'Entrar'}
            </Button>
          </form>
        </Paper>
      </Box>

      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          borderLeft: (t) => `1px solid ${t.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={mechanic}
          alt="Mecânico usando celular"
          sx={{
            width: '100%',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: 'initial',
            display: 'block',
          }}
        />
      </Box>
    </Box>
  );
}
