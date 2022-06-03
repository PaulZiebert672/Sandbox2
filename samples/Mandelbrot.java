/*
 * Run as `java Mandelbrot.java`
 */
package lab51.demo.calc;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.ImageIcon;

import java.awt.EventQueue;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.image.BufferedImage;

import java.util.Arrays;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.IntStream;
import java.util.logging.Logger;

public class Mandelbrot {

    private static final Logger LOG =
        Logger.getLogger(Mandelbrot.class.getName());

    public static final int WIDTH = 1280;
    public static final int HEIGHT = 720;
    public static final int DETAIL = 2 * 1024;
    public static final double ZOOM_STEP = 2.5;

    private static final double LOG_STEP = Math.log(2) / 8;

    private static double top = -1.0;
    private static double left = -2.25;
    private static double zoom = 1.0 / 384.0;

    private static BufferedImage image;
    private static JFrame frame;

    public static void main(String[] args) {
        EventQueue.invokeLater(() -> {
            image = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
            JLabel label = new JLabel(new ImageIcon(image));
            label.addMouseListener(mouseListener());

            frame = new JFrame("The Mandelbrot Set");
            frame.add(label);
            frame.pack();
            frame.setVisible(true);
            frame.setResizable(false);
            // frame.setExtendedState(frame.getExtendedState() | JFrame.MAXIMIZED_BOTH);
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

            LOG.info(String.format(
                "JLabel position: X=%d, Y=%d",
                label.getX(),
                label.getY()
            ));
            calculateImage(left, top, zoom);
        });
    }

    private static MouseListener mouseListener() {
        return new MouseAdapter() {
            @Override
            public void mouseReleased(MouseEvent event) {
                if (event.getButton() == MouseEvent.BUTTON1) {
                    LOG.info(String.format(
                        "Zoom in. Coordinates: X=%d, Y=%d",
                        event.getX(),
                        event.getY()
                    ));
                    // zoom in
                    left = (event.getX() - WIDTH / ZOOM_STEP / 2.0) * zoom + left;
                    top = (event.getY() - HEIGHT / ZOOM_STEP / 2.0) * zoom + top;
                    zoom = zoom / ZOOM_STEP;
                } else {
                    LOG.info(String.format(
                        "Zoom out. Coordinates: X=%d, Y=%d",
                        event.getX(),
                        event.getY()
                    ));
                    // zoom out
                    left = (event.getX() - WIDTH * ZOOM_STEP / 2.0) * zoom + left;
                    top = (event.getY() - HEIGHT * ZOOM_STEP / 2.0) * zoom + top;
                    zoom = zoom * ZOOM_STEP;
                }
                calculateImage(left, top, zoom);
            }
        };
    }

    private static Executor executor = Executors.newSingleThreadExecutor();

    private static void calculateImage(
        double left,
        double top,
        double zoom
    ) {
        executor.execute(() -> {
            // printThreadInfo();
            LOG.info(String.format(
                "Window: left=%f, top=%f, zoom=%.16f",
                left,
                top,
                zoom
            ));
            IntStream.range(0, HEIGHT).parallel().forEach((int y) -> {
                double ci = y * zoom + top;

                for (int x = 0; x < WIDTH; ++x) {
                    double cr = x * zoom + left;

                    double zr = 0.0;
                    double zi = 0.0;
                    int color = 0x000000; // paint The Mandelbrot Set black
                    for (int i = 0; i < DETAIL; ++i) {
                        double zrzr = zr * zr;
                        double zizi = zi * zi;
                        if (zrzr + zizi >= 4) {
                            // c is outside The Mandelbrot Set
                            // color = PALETTE[i & 15];
                            color = PALETTE[getIndexColor(i) & 15];
                            break;
                        }
                        zi = 2.0 * zr * zi + ci;
                        zr = zrzr - zizi + cr;
                    }
                    image.setRGB(x, y, color);
                }
                frame.repaint();
            });
        });
    }

    private static int getIndexColor(int n) {
        return (n <= 15)? n: (int) Math.floor(Math.log(n) / LOG_STEP);
    }

    private static void printThreadInfo() {
        System.out.println(Thread.currentThread());
        Arrays.stream(Thread.currentThread().getStackTrace())
            .skip(2)
            .limit(4)
            .forEach(System.out::println);
        System.out.println();
    }

    private static final int[] PALETTE = {
            0x00421E0F, 0x0019071A, 0x0009012F, 0x00040449,
            0x00000764, 0x000C2C8A, 0x001852B1, 0x00397DD1,
            0x0086B5E5, 0x00D3ECF8, 0x00F1E9BF, 0x00F8C95F,
            0x00FFAA00, 0x00CC8000, 0x00995700, 0x006A3403,
    };
}
