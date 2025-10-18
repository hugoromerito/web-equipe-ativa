'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Palette, 
  Moon, 
  Sun, 
  Monitor, 
  Heart, 
  Activity, 
  Users,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react'
import { MedicalHeader } from '@/components/medical-header'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'

export default function ThemeShowcasePage() {
  const [selectedVariant, setSelectedVariant] = useState<string>('medical')

  const cardVariants = [
    { name: 'default', label: 'Padrão' },
    { name: 'medical', label: 'Médico' },
    { name: 'elevated', label: 'Elevado' },
    { name: 'interactive', label: 'Interativo' },
    { name: 'glass', label: 'Vidro' },
  ]

  const badgeExamples = [
    { variant: 'medical', label: 'Médico' },
    { variant: 'medical-success', label: 'Sucesso' },
    { variant: 'medical-warning', label: 'Atenção' },
    { variant: 'medical-danger', label: 'Crítico' },
    { variant: 'medical-info', label: 'Informação' },
  ]

  const statusExamples = [
    { status: 'RESOLVED', icon: CheckCircle, color: 'success' },
    { status: 'PENDING', icon: Clock, color: 'warning' },
    { status: 'IN_PROGRESS', icon: Activity, color: 'info' },
    { status: 'REJECTED', icon: AlertCircle, color: 'danger' },
  ]

  const mockData = [
    { id: 1, name: 'Dr. Ana Silva', role: 'Cardiologista', status: 'online', patients: 23 },
    { id: 2, name: 'Dr. Carlos Santos', role: 'Neurologista', status: 'offline', patients: 18 },
    { id: 3, name: 'Dra. Maria Costa', role: 'Pediatra', status: 'online', patients: 31 },
    { id: 4, name: 'Dr. João Oliveira', role: 'Cirurgião', status: 'busy', patients: 12 },
  ]

  return (
    <div className="space-y-8 p-6">
      <MedicalHeader
        title="Sistema de Tema Dark"
        subtitle="Demonstração completa do tema escuro médico profissional"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="medical" className="flex items-center gap-1">
              <Palette className="h-3 w-3" />
              Tema Completo
            </Badge>
            <ThemeSwitcher />
          </div>
        }
      />

      {/* Cards de Demonstração */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          Variações de Card
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardVariants.map((variant) => (
            <Card 
              key={variant.name} 
              variant={variant.name as any}
              className="cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedVariant(variant.name)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Card {variant.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Exemplo de card com variante {variant.label.toLowerCase()}. 
                  Este card demonstra o visual no tema atual.
                </p>
                <div className="mt-4 flex gap-2">
                  <Badge variant="outline">Exemplo</Badge>
                  <Badge variant={selectedVariant === variant.name ? 'default' : 'secondary'}>
                    {selectedVariant === variant.name ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Badges de Demonstração */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Sistema de Badges
        </h2>
        
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {badgeExamples.map((badge) => (
                <div key={badge.variant} className="text-center space-y-2">
                  <Badge variant={badge.variant as any} size="lg">
                    {badge.label}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {badge.variant}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Status Indicators */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Indicadores de Status
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusExamples.map((status) => (
            <Card key={status.status} variant="interactive">
              <CardContent className="p-6 text-center">
                <status.icon className={`h-8 w-8 mx-auto mb-3 ${
                  status.color === 'success' ? 'text-green-500' :
                  status.color === 'warning' ? 'text-yellow-500' :
                  status.color === 'info' ? 'text-blue-500' :
                  'text-red-500'
                }`} />
                <Badge 
                  status={status.status as any}
                  className="mb-2"
                >
                  {status.status.replace('_', ' ')}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Status {status.status.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tabela de Demonstração */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Tabela com Dark Mode
        </h2>
        
        <Card variant="elevated" className="overflow-hidden">
          <Table variant="medical">
            <TableHeader>
              <TableRow>
                <TableHead>Profissional</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pacientes</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.status === 'online' ? 'medical-success' :
                        item.status === 'busy' ? 'medical-warning' :
                        'outline'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {item.patients}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        Ver
                      </Button>
                      <Button size="sm" variant="medical">
                        Editar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Controles de Tema */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Monitor className="h-6 w-6 text-primary" />
          Controle de Temas
        </h2>
        
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold">Alternador de Tema Avançado</h3>
                <p className="text-sm text-muted-foreground">
                  Suporte completo para temas claro, escuro e sistema com transições suaves
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sun className="h-4 w-4" />
                  <span>Claro</span>
                </div>
                
                <ThemeSwitcher />
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Moon className="h-4 w-4" />
                  <span>Escuro</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Estatísticas do Sistema */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Estatísticas do Sistema
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="medical" className="medical-hover-lift">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-2xl font-bold text-foreground">1,234</div>
              <p className="text-sm text-muted-foreground">Usuários Ativos</p>
            </CardContent>
          </Card>
          
          <Card variant="medical" className="medical-hover-lift">
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <div className="text-2xl font-bold text-foreground">98.5%</div>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </CardContent>
          </Card>
          
          <Card variant="medical" className="medical-hover-lift">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-3 text-red-500" />
              <div className="text-2xl font-bold text-foreground">456</div>
              <p className="text-sm text-muted-foreground">Consultas Hoje</p>
            </CardContent>
          </Card>
          
          <Card variant="medical" className="medical-hover-lift">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <div className="text-2xl font-bold text-foreground">+12%</div>
              <p className="text-sm text-muted-foreground">Crescimento</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}