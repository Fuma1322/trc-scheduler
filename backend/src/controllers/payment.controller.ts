import type { Request, Response } from 'express';
import {
  listPayments as getPayments,
  updatePaymentStatus as savePaymentStatus,
} from '../services/payment.service';

export async function listPayments(req: Request, res: Response) {
  try {
    const status =
      typeof req.query.status === 'string' ? req.query.status : undefined;

    const payments = await getPayments(status);

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Could not load payments.';

    const statusCode = message === 'Invalid payment status filter.' ? 400 : 500;

    if (statusCode === 500) {
      console.error('List payments error:', error);
    }

    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? 'Could not load payments.' : message,
    });
  }
}

export async function updatePaymentStatus(req: Request, res: Response) {
  try {
    const adminEmail = req.admin?.email;

    if (!adminEmail) {
      return res.status(401).json({
        success: false,
        message: 'Administrator identity is missing.',
      });
    }

    const result = await savePaymentStatus(
      String(req.params.id),
      req.body?.status,
      adminEmail,
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Could not update payment.';

    const statusCode =
      message === 'Booking not found.'
        ? 404
        : message === 'Invalid booking ID.' ||
            message === 'Invalid payment status.'
          ? 400
          : 500;

    if (statusCode === 500) {
      console.error('Update payment status error:', error);
    }

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500 ? 'Could not update payment.' : message,
    });
  }
}
