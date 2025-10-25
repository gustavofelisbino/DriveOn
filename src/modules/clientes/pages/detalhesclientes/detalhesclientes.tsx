// ClienteDetalhesPage.jsx

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Stack,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  IconButton,
  Button
} from "@mui/material"
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded"
import EditRoundedIcon from "@mui/icons-material/EditRounded"
import { alpha } from "@mui/material/styles"

import { obterClienteDetalhes } from "./apidetalhes/api"
import ClienteVeiculos from "./subcomponentes/clienteveiculos"
import ClienteOrdens from "./subcomponentes/clienteordens"
import ClientePagamentos from "./subcomponentes/clientepagamentos"
import ClienteHeaderCard from "./subcomponentes/clienteinfo"

export default function ClienteDetalhesPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [tab, setTab] = React.useState(0)
  const [cliente, setCliente] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
    ;(async () => {
      try {
        const data = await obterClienteDetalhes(Number(id))
        setCliente(data)
      } catch (err) {
        console.error("Erro ao carregar cliente:", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!cliente) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Cliente não encontrado
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <IconButton onClick={() => nav(-1)}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          Detalhes do Cliente
        </Typography>
      </Stack>

      <ClienteHeaderCard cliente={cliente} onEditar={() => handleEdit(cliente.id)} />

      <Paper
        elevation={1}
        sx={{
          mt: 3,
          borderRadius: 2,
          border: (t) => `1px solid ${t.palette.divider}`,
          bgcolor: (t) => alpha(t.palette.primary.main, 0.015)
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            px: 2
          }}
        >
          <Tab label="Veículos" />
          <Tab label="Ordens de Serviço" />
          <Tab label="Pagamentos" />
        </Tabs>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {tab === 0 && <ClienteVeiculos veiculos={cliente.veiculos} />}
          {tab === 1 && <ClienteOrdens ordens={cliente.ordens} />}
          {tab === 2 && (
            <ClientePagamentos
              clienteId={cliente.id}
              oficina_id={cliente.oficina_id}
            />
          )}
        </Box>
      </Paper>
    </Box>
  )
}
