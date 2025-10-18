'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMembersOrganization, useMembersUnit } from '@/hooks/use-members'
import { ROLE_OPTIONS } from '@/constants/role-translations'
import { Loader2, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function MembersPage() {
  const params = useParams<{ org: string }>()
  const organizationSlug = params.org

  const [orgPage, setOrgPage] = useState(1)
  const [activeTab, setActiveTab] = useState('organization')

  const { data: orgMembersData, isLoading: isLoadingOrg } =
    useMembersOrganization({
      organizationSlug,
      page: orgPage,
      pageSize: 20,
    })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Membros</h1>
          <p className="text-muted-foreground">
            Visualize os membros da organização e unidades
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {orgMembersData?.totalCount || 0} membros
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="organization">Organização</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          {isLoadingOrg ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Membro</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Função</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orgMembersData?.members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div 
                              className={`avatar-container ${
                                member.is_online ? 'avatar-online' : 'avatar-offline'
                              }`}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.user.avatar_url || ''} />
                                <AvatarFallback>
                                  {member.user.name
                                    ?.split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <span className="font-medium">
                              {member.user.name || 'Sem nome'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {member.user.email}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              member.is_online 
                                ? 'status-badge-online' 
                                : 'status-badge-offline'
                            }
                          >
                            <div
                              className={`h-2 w-2 rounded-full ${
                                member.is_online ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                            />
                            {member.is_online ? 'Online' : 'Offline'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                            {ROLE_OPTIONS.find(
                              (r) => r.value === member.organization_role
                            )?.label || member.organization_role}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}

                    {orgMembersData?.members.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <p className="text-muted-foreground">
                            Nenhum membro encontrado
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {orgMembersData &&
                orgMembersData.totalCount > 20 &&
                Math.ceil(orgMembersData.totalCount / 20) > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Página {orgPage} de{' '}
                      {Math.ceil(orgMembersData.totalCount / 20)} (
                      {orgMembersData.totalCount} membros)
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrgPage((p) => Math.max(1, p - 1))}
                        disabled={orgPage === 1}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrgPage((p) => p + 1)}
                        disabled={
                          orgPage >= Math.ceil(orgMembersData.totalCount / 20)
                        }
                      >
                        Próxima
                      </Button>
                    </div>
                  </div>
                )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
