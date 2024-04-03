import cors from 'cors';
import express from 'express';
import { container } from 'tsyringe';

import { ProposalPDFData } from '../../../factory/pdf/proposal';
import { collectSamplePDFData } from '../../../factory/pdf/sample';
import { collectShipmentPDFData } from '../../../factory/pdf/shipmentLabel';
import callFactoryService, {
  DownloadType,
  MetaBase,
  PDFType,
} from '../../../factory/service';
import { getCurrentTimestamp } from '../../../factory/util';
import FactoryServices, { DownloadTypeServices } from '../factoryServices';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const corsOptionsDelegate = function (req: any, callback: any) {
  let corsOptions;
  let allowlist;
  if (process.env && process.env.PDF_DOWNLOAD_WHITELISTED_ORIGINS) {
    const whitelistedOrigins = process.env
      .PDF_DOWNLOAD_WHITELISTED_ORIGINS as string;
    allowlist = whitelistedOrigins.split(',');
  }
  if (
    Array.isArray(allowlist) &&
    allowlist.length !== 0 &&
    allowlist.indexOf(req.header('Origin')) !== -1
  ) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

router.get(
  `/${PDFType.PROPOSAL}/:proposal_pks`,
  cors(corsOptionsDelegate),
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw new Error('Not authorized');
      }
      const factoryServices =
        container.resolve<DownloadTypeServices>(FactoryServices);

      const userWithRole = {
        ...res.locals.agent,
      };
      const proposalPks: number[] = req.params.proposal_pks
        .split(',')
        .map((n: string) => parseInt(n))
        .filter((id: number) => !isNaN(id));

      const meta: MetaBase = {
        collectionFilename: `proposals_${getCurrentTimestamp()}.pdf`,
        singleFilename: '',
      };

      const data = await factoryServices.getPdfProposals(
        userWithRole,
        proposalPks,
        meta,
        {
          filter: req.query?.filter?.toString(),
        }
      );

      if (!data) {
        throw new Error('Could not get proposal details');
      }

      const userRole = req.user.currentRole;
      callFactoryService<ProposalPDFData, MetaBase>(
        DownloadType.PDF,
        PDFType.PROPOSAL,
        { data, meta, userRole },
        req,
        res,
        next
      );
    } catch (e) {
      next(e);
    }
  }
);

router.get(`/${PDFType.SAMPLE}/:sample_ids`, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error('Not authorized');
    }

    const userWithRole = {
      ...req.user.user,
      currentRole: req.user.currentRole,
    };

    const sampleIds: number[] = req.params.sample_ids
      .split(',')
      .map((n: string) => parseInt(n))
      .filter((id: number) => !isNaN(id));

    const meta: MetaBase = {
      collectionFilename: `samples_${getCurrentTimestamp()}.pdf`,
      singleFilename: '',
    };
    const data = await Promise.all(
      sampleIds.map((sampleId, indx) =>
        collectSamplePDFData(
          sampleId,
          userWithRole,
          indx === 0
            ? (filename: string) => (meta.singleFilename = filename)
            : undefined
        )
      )
    );

    const userRole = req.user.currentRole;
    callFactoryService(
      DownloadType.PDF,
      PDFType.SAMPLE,
      { data, meta, userRole },
      req,
      res,
      next
    );
  } catch (e) {
    next(e);
  }
});

router.get(
  `/${PDFType.SHIPMENT_LABEL}/:shipment_ids`,
  async (req, res, next) => {
    if (!req.user) {
      throw new Error('Not authorized');
    }

    try {
      const userWithRole = {
        ...req.user.user,
        currentRole: req.user.currentRole,
      };

      const shipmentIds: number[] = req.params.shipment_ids
        .split(',')
        .map((n: string) => parseInt(n))
        .filter((id: number) => !isNaN(id));

      const meta: MetaBase = {
        collectionFilename: `shipment_label_${getCurrentTimestamp()}.pdf`,
        singleFilename: '',
      };
      const data = await Promise.all(
        shipmentIds.map((shipmentId, indx) =>
          collectShipmentPDFData(
            shipmentId,
            userWithRole,
            indx === 0
              ? (filename: string) => (meta.singleFilename = filename)
              : undefined
          )
        )
      );

      const userRole = req.user.currentRole;
      callFactoryService(
        DownloadType.PDF,
        PDFType.SHIPMENT_LABEL,
        { data, meta, userRole },
        req,
        res,
        next
      );
    } catch (e) {
      next(e);
    }
  }
);

export default function pdfDownload() {
  return router;
}
