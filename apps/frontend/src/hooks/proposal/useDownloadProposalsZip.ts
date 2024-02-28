import { useCallback, useContext } from 'react';

import {
  DownloadContext,
  PREPARE_DOWNLOAD_TYPE,
} from 'context/DownloadContextProvider';

export function useDownloadPDFProposalsZip() {
  const { prepareDownload } = useContext(DownloadContext);
  const downloadProposalAttachment = useCallback(
    (proposalPks: number[]) => {
      prepareDownload(
        PREPARE_DOWNLOAD_TYPE.ZIP_PROPOSAL,
        proposalPks,
        'proposal'
      );
    },
    [prepareDownload]
  );

  return downloadProposalAttachment;
}
