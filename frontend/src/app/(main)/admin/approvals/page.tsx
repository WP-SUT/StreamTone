"use client";

import { useEffect, useState } from "react";
import { Check, X, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { AdminEmptyState } from "@/components/admin/empty-state";
import { TableSkeleton } from "@/components/admin/skeleton";
import { RejectArtistModal } from "@/components/admin/reject-artist-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStaffGuard } from "@/hooks/use-staff-guard";
import { verificationService } from "@/services/verification-service";
import type { VerificationRequest } from "@/types/models";
import { UserCheck } from "lucide-react";

export default function AdminApprovalsPage() {
  const { user, loading: authLoading } = useStaffGuard("admin");
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<VerificationRequest | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    const data = await verificationService.getPending();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id: string) => {
    if (!user) return;
    setActionId(id);
    try {
      await verificationService.approve(id, user.id);
      toast.success("Artist approved");
      await load();
      if (selected?.id === id) setSelected(null);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (reason: string) => {
    if (!user || !selected) return;
    await verificationService.reject(selected.id, user.id, reason);
    toast.success("Artist rejected");
    setSelected(null);
    await load();
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-6 md:px-8">
      <PageHeader
        title="Artist Approvals"
        description="Review pending artist verification requests"
      />

      {loading ? (
        <TableSkeleton rows={3} />
      ) : requests.length === 0 ? (
        <AdminEmptyState
          icon={UserCheck}
          title="No pending requests"
          description="All artist applications have been reviewed."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase text-zinc-500">
                  <th className="px-4 py-3">Artist</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelected(req)}
                    className={`cursor-pointer border-b border-zinc-800/50 transition-colors hover:bg-zinc-900/60 ${
                      selected?.id === req.id ? "bg-purple-600/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-white">{req.artistName}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {verificationService.getArtistEmail(req.artistId)}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(req.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            {selected ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selected.artistName}</h3>
                  <p className="text-sm text-zinc-400">
                    {verificationService.getArtistEmail(selected.artistId)}
                  </p>
                  <Badge variant="outline" className="mt-2 border-amber-500/30 text-amber-400">
                    Pending Review
                  </Badge>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-zinc-400">Portfolio Samples</p>
                  <ul className="space-y-2">
                    {selected.portfolioUrls.map((url, i) => (
                      <li key={i}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-purple-400 hover:underline"
                        >
                          Sample {i + 1}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleApprove(selected.id)}
                    disabled={actionId === selected.id}
                    className="flex-1"
                  >
                    {actionId === selected.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="mr-1.5 h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setRejectOpen(true)}
                    disabled={actionId === selected.id}
                    className="flex-1"
                  >
                    <X className="mr-1.5 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-zinc-500 py-12">
                Select a request to review details
              </p>
            )}
          </div>
        </div>
      )}

      <RejectArtistModal
        open={rejectOpen}
        artistName={selected?.artistName ?? ""}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
      />
    </div>
  );
}
